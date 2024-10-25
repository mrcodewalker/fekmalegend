import {Component, ViewChild, ElementRef, OnInit, NgZone} from '@angular/core';
import {ScoreService} from "../services/score.service";
import {Dialog} from "@angular/cdk/dialog";
import {DialogComponent} from "../dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {Observable} from "rxjs";
import {environment} from "../enviroments/enviroment";
import {setTime} from "@syncfusion/ej2-angular-schedule";
import {FileUploadService} from "../services/file.upload.service";

@Component({
  selector: 'app-file-import',
  templateUrl: './file-import.component.html',
  styleUrls: ['./file-import.component.scss']
})
export class FileImportComponent implements OnInit{
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  types: string[] = ['Có trang giới thiệu mở đầu', 'Không có trang giới thiệu'];
  selectedType: string = this.types[0];
  selectedFileName: string = '';
  pdfSrc: string | null = null;
  readyToSend: File | null = null;
  semester: string = '';
  currentRequestIndex = 0;
  progressMessages: string[] = [];
  constructor(
    private scoreService: ScoreService,
    private dialog: MatDialog,
    private zone: NgZone,
    private fileService: FileUploadService
  ) {
  }
  ngOnInit() {
    this.progress = 0;
    // this.scoreService.updateProgress$.subscribe((message: string) => {
    //   this.progressMessages.push(message);
    // });
    //
    // // Bắt đầu quá trình cập nhật
    // this.updateRankings();
  }


  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const dropArea = event.currentTarget as HTMLElement;
    dropArea.classList.add('drag-over');
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const dropArea = event.currentTarget as HTMLElement;
    dropArea.classList.remove('drag-over');
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.readyToSend = files[0];
      this.handleFiles(files);
    }
    const dropArea = event.currentTarget as HTMLElement;
    dropArea.classList.remove('drag-over');
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.readyToSend = input.files[0];
      this.handleFiles(input.files);
    }
  }

  handleFiles(files: FileList) {
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        const reader = new FileReader();
        this.selectedFileName = file.name; // Đổi tên file
        reader.onload = (e) => {
          this.pdfSrc = e.target?.result as string; // Set PDF source
        };
        reader.readAsDataURL(file); // Read file as DataURL
      } else {
        alert('Please upload a valid PDF file.');
      }
    }
  }
  openDialog(title: string, message: string): Promise<void> {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { title, message },
      width: '400px'
    });

    return dialogRef.afterClosed().toPromise();
  }
  requests: { progress: number; status: string; completed: boolean }[] = Array(10).fill(null).map(() => ({
    progress: 0,
    status: 'In Progress...',
    completed: false
  }));
  formRequest: string[] = [
    'Updating GPA...',
    'GPA has been updated successfully',
    'Updating Block Ranking...',
    'Block ranking has been updated successfully',
    'Updating Class Ranking...',
    'Class ranking has been updated successfully',
    'Updating Block Detail Ranking...',
    'Block Detail Ranking has been updated successfully',
    'Updating Major Ranking...',
    'Major Ranking has been updated successfully',
    'Updating Semester Table...',
    'Semester Table has been updated successfully',
    'Updating Semester Ranking...',
    'Semester ranking has been updated successfully',
    'Updating Scholarship...',
    'Scholarship has been updated successfully',
    'The last updating...',
    'Data has been updated successfully! (Completed)'
  ];

  currentStatus: string = 'Waiting...'; // Trạng thái hiện tại
  progress: number = 0; // Giá trị thanh tiến trình
  statusIndex: number = 0; // Index của formRequest hiện tại

  async onUpdate() {
    await this.openDialog("Are you sure?","Please check your action before update data");
    this.progress = 0;
    this.statusIndex = 0;
    this.currentStatus = this.formRequest[this.statusIndex]; // Bắt đầu với trạng thái "Updating..."

    const progressInterval = setInterval(() => {
      if (this.progress < 99) {
        this.updateProgressData(this.progress); // Cập nhật giá trị tiến trình
        this.progress++; // Tăng tiến trình

        if (this.progress % 11 === 0 && this.statusIndex < this.formRequest.length - 1) {
          this.currentStatus = this.formRequest[++this.statusIndex]; // Hiển thị "Updating..."
          setTimeout(() => {
            if (this.statusIndex < this.formRequest.length - 1) {
              this.currentStatus = this.formRequest[++this.statusIndex]; // Hiển thị "Updated successfully"
            }
          }, 5000);
        }
      } else {
        this.progress = 100;
        this.currentStatus = 'Data has been updated successfully! (Completed)';
        this.requests[this.currentRequestIndex].completed = true;
        clearInterval(progressInterval);
        this.openDialog("Congratulations!","GPA has been updated successfully!");
      }
    }, 200); // Cập nhật mỗi 500ms

    // Chờ đến khi cập nhật hoàn tất
    const data = await this.scoreService.updateData().toPromise();

    // Kiểm tra trạng thái của dữ liệu sau khi cập nhật
    if (data.status === 200) {
      this.progress = 100;
      this.currentStatus = 'Data has been updated successfully! (Completed)';
      this.requests[this.currentRequestIndex].completed = true;
      await this.openDialog("Congratulations!","GPA has been updated successfully!");
    }

    // Dừng interval (điều này không cần thiết ở đây vì đã dừng trong setInterval)
    // clearInterval(progressInterval); // Bạn có thể loại bỏ dòng này
  }




  progressName: string = '';
  updateRankings() {
    const eventSource = new EventSource(`${environment.apiBaseUrl}/ranking/query/update`);
    // Reset progress before receiving messages
    this.progress = 0;
    let progressInterval: ReturnType<typeof setInterval> | null = null; // Use ReturnType<typeof setInterval>
    this.currentRequestIndex = 0;

    eventSource.onmessage = (event) => {
      const message = event.data;
      console.log('Received message:', message); // Log the message for debugging
      this.updateMessageProgress(message);
      // Clear previous progress interval if it exists

      this.zone.run(() => {
        this.incrementCurrentIndex();
        this.updateMessageProgress(message);
        this.progressName = message.toString(); // Update the message in the UI
        if (this.progressName.toLowerCase()==="all updates completed"){
          this.progress = 100;
        }
      });

      if (progressInterval) {
        clearInterval(progressInterval);
      }

      // Start a new progress interval for the current message
      progressInterval = setInterval(() => {
        if (this.progress < 99) {
          this.updateProgressData(this.progress); // Update the progress display
          this.progress++; // Increase progress
        } else {
          clearInterval(progressInterval!); // Stop interval when reaching 99%
          this.progress = 100; // Set to 100% when completed

          // Wait for 1 second before resetting progress for the next message
          setTimeout(() => {
            this.progress = 0; // Reset progress for the next message
            this.updateProgressData(this.progress); // Update the progress display
          }, 1000);
        }
      }, 100); // Increase progress every 100 ms for smoother animation
    };
    eventSource.onerror = (error) => {
      console.error('Error in EventSource:', error);
      eventSource.close(); // Close the connection on error
    };
  }

  async saveFileUploaded(){
    const data = await this.fileService.uploadFile(this.readyToSend).toPromise();
    await this.readFile();
    await this.loadingFrame();
  }

  async onComplete() {
    this.currentRequestIndex = 0;
    console.log('Selected Type:', this.selectedType);
    const semesterPattern = /^ki[1-2]-\d{4}-\d{4}$/;
    if (!semesterPattern.test(this.semester)) {
      await this.openDialog("Warning", "Please check your semester data (example: ki2-2023-2024)");
      return; // Ngừng thực hiện nếu không hợp lệ
    }
    const totalRequests = this.requests.length; // Tổng số request
    await this.saveFileUploaded();
    if (this.readyToSend) {
      this.fileService.uploadFileToDataLake(this.readyToSend).toPromise();
    }
    await this.openDialog("Congratulations!", "Update data has been successfully!");
      // Cập nhật tiến trình
  }
  async readFile(){
    if (!this.readyToSend){
      this.openDialog("Warning", "Please import a PDF file!");
      return;
    }
    this.updateMessageProgress('Reading file is already...');
    this.progress = 0; // Reset tiến trình về 0
    this.currentStatus = 'Reading file is already...';
    // Giả lập thanh tiến trình với setTimeout
    const progressInterval = setInterval(() => {
      if (this.progress < 99) {
        this.updateProgressData(this.progress); // Cập nhật giá trị tiến trình
        this.progress++; // Tăng tiến trình
      } else {
        clearInterval(progressInterval); // Dừng interval khi đạt 99
      }
    }, 1000); // Cập nhật mỗi 100ms
    const updateScore = await this.scoreService.importPDF(this.readyToSend, this.selectedType, this.semester).toPromise();
    clearInterval(progressInterval);
    if (updateScore.status==='200'){
      this.updateProgressData(99);
      this.updateSuccessfully('File has been read successfully!');
      this.currentStatus = 'File has been read successfully!';
    } else {
      this.openDialog("Warning", "Some wrong was happened!");
      return;
    }
  }
  async updateRanking(){
    this.updateMessageProgress('Update ranking is loading...');
    const updateBlockRanking = await this.scoreService.updateRanking().toPromise();
    if (updateBlockRanking.status==='200'){
      this.updateProgress();
      this.updateSuccessfully('Update ranking successfully!');
    } else {
      this.openDialog("Warning", "Some wrong was happened!");
      return;
    }
  }
  async updateBlockRanking(){
    this.updateMessageProgress('Update block ranking is loading...');
    const updateBlockRanking = await this.scoreService.updateBlockRanking().toPromise();
    if (updateBlockRanking.status==='200'){
      this.updateProgress();
      this.updateSuccessfully('Update block ranking successfully!');
    } else {
      this.openDialog("Warning", "Some wrong was happened!");
      return;
    }
  }
  async updateClassRanking(){
    this.updateMessageProgress('Update class ranking is loading...');
    const updateBlockRanking = await this.scoreService.updateClassRanking().toPromise();
    if (updateBlockRanking.status==='200'){
      this.updateProgress();
      this.updateSuccessfully('Update class ranking successfully!');
    } else {
      this.openDialog("Warning", "Some wrong was happened!");
      return;
    }
  }
  async updateMajorRanking(){
    this.updateMessageProgress('Update major ranking is loading...');
    const updateBlockRanking = await this.scoreService.updateMajorRanking().toPromise();
    if (updateBlockRanking.status==='200'){
      this.updateProgress();
      this.updateSuccessfully('Update major ranking successfully!');
    } else {
      this.openDialog("Warning", "Some wrong was happened!");
      return;
    }
  }
  async updateBlockDetailRanking(){
    this.updateMessageProgress('Update block detail ranking is loading...');
    const updateBlockRanking = await this.scoreService.updateMajorRanking().toPromise();
    if (updateBlockRanking.status==='200'){
      this.updateProgress();
      this.updateSuccessfully('Update block detail ranking successfully!');
    } else {
      this.openDialog("Warning", "Some wrong was happened!");
      return;
    }
  }
  async updateSemesterTable(){
    this.updateMessageProgress('Update semester table data is loading...');
    const updateBlockRanking = await this.scoreService.updateSemesterTable().toPromise();
    if (updateBlockRanking.status==='200'){
      this.updateProgress();
      this.updateSuccessfully('Update semester table data successfully!');
    } else {
      this.openDialog("Warning", "Some wrong was happened!");
      return;
    }
  }
  async updateSemesterRanking(){
    this.updateMessageProgress('Update semester ranking is loading...');
    const updateBlockRanking = await this.scoreService.updateSemesterTable().toPromise();
    if (updateBlockRanking.status==='200'){
      this.updateProgress();
      this.updateSuccessfully('Update semester ranking successfully!');
    } else {
      this.openDialog("Warning", "Some wrong was happened!");
      return;
    }
  }
  async updateScholarShip(){
    this.updateMessageProgress('Update scholarship is loading...');
    const updateBlockRanking = await this.scoreService.updateScholarship().toPromise();
    if (updateBlockRanking.status==='200'){
      this.updateProgress();
      this.updateSuccessfully('Update scholarship successfully!');
    } else {
      this.openDialog("Warning", "Some wrong was happened!");
      return;
    }
  }
  async loadingFrame(){
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  updateProgress(){
    this.progress = Math.round((this.currentRequestIndex+1 / this.requests.length) * 100);
  }
  updateProgressData(index: number){
    this.requests[this.currentRequestIndex].progress = index+1;
  }
  updateMessageProgress(message: string){
    this.requests[this.currentRequestIndex].status = message;
  }
  updateSuccessfully(message: string){
    this.requests[this.currentRequestIndex].completed = true; // Đánh dấu là hoàn thành
    this.requests[this.currentRequestIndex].progress = 100; // Đặt tiến trình thành 100%
    this.requests[this.currentRequestIndex].status = message;
  }
  incrementCurrentIndex(){
    this.currentRequestIndex++;
  }

  // Giả sử bạn có hàm này để xử lý các request

  async makeRequest(index: number) {
    // Giả lập việc gọi request
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Request ${index} completed.`);
        resolve(true);
      }, 1000); // Giả lập thời gian xử lý 1 giây cho mỗi request
    });
  }
}
