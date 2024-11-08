import {Component, ViewChild, ElementRef, OnInit, NgZone, HostListener} from '@angular/core';
import {ScoreService} from "../services/score.service";
import {Dialog} from "@angular/cdk/dialog";
import {DialogComponent} from "../dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {Observable} from "rxjs";
import {environment} from "../enviroments/enviroment";
import {setTime} from "@syncfusion/ej2-angular-schedule";
import {FileUploadService} from "../services/file.upload.service";
import {AuthService} from "../services/auth.service";

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
    private fileService: FileUploadService,
    private authService: AuthService
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
  isPdfFile(file: File): boolean {
    return file.type === 'application/pdf';
  }
  isPreviewModalOpen: boolean = false;
  zoom: number = 1.0;
  openPreviewModal() {
    if (this.pdfSrc) {
      this.isPreviewModalOpen = true;
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }
  }
  closePreviewModal() {
    this.isPreviewModalOpen = false;
    // Restore body scrolling
    document.body.style.overflow = 'auto';
  }

  zoomIn() {
    if (this.zoom < 2) {
      this.zoom += 0.1;
    }
  }

  zoomOut() {
    if (this.zoom > 0.5) {
      this.zoom -= 0.1;
    }
  }

  // Add event listener for escape key
  @HostListener('document:keydown.escape')
  onEscapePress() {
    this.closePreviewModal();
  }
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.readyToSend = files[0];
      const file = files[0];
      if (this.isPdfFile(file)) {
        this.readyToSend = file;
        this.handleFiles(files);
      } else {
        this.openDialog('Warning', 'Please upload a valid PDF file.');
      }
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
        this.openDialog('Warning', 'Please upload a valid PDF file.');
        this.pdfSrc = null;
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
    console.log('Selected Type:', this.selectedType);
    this.currentRequestIndex = 0;
    const totalRequests = this.requests.length; // Tổng số request
    // await this.saveFileUploaded();
    if (this.readyToSend) {
      this.fileService.uploadFileToDataLake(this.readyToSend).toPromise();
    }
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
    const updateScore = await this.scoreService.importPDF(this.readyToSend, this.selectedType, this.semester,
      this.authService.getUserId()||'1').toPromise();
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
  isConfirmationModalOpen = false;

  onUpdate() {
    this.isConfirmationModalOpen = true;
  }

  confirmUpdate() {
    this.isConfirmationModalOpen = false;

    // Gọi hàm cập nhật
    this.performUpdate();
  }

  closeConfirmationModal() {
    this.isConfirmationModalOpen = false;
  }

  performUpdate() {
    // Thực hiện quá trình cập nhật như mã đã có ở đây
    this.progress = 0;
    this.statusIndex = 0;
    this.currentStatus = this.formRequest[this.statusIndex];

    const progressInterval = setInterval(() => {
      if (this.progress < 99) {
        this.updateProgressData(this.progress);
        this.progress++;

        if (this.progress % 11 === 0 && this.statusIndex < this.formRequest.length - 1) {
          this.currentStatus = this.formRequest[++this.statusIndex];
          setTimeout(() => {
            if (this.statusIndex < this.formRequest.length - 1) {
              this.currentStatus = this.formRequest[++this.statusIndex];
            }
          }, 5000);
        }
      } else {
        this.progress = 100;
        this.currentStatus = 'Data has been updated successfully! (Completed)';
        this.requests[this.currentRequestIndex].completed = true;
        clearInterval(progressInterval);
        this.openDialog("Congratulations!", "GPA has been updated successfully!");
      }
    }, 200);

    // Thực hiện yêu cầu cập nhật dữ liệu
    this.scoreService.updateData().toPromise().then(data => {
      if (data.status === 200) {
        this.progress = 100;
        this.currentStatus = 'Data has been updated successfully! (Completed)';
        this.requests[this.currentRequestIndex].completed = true;
        this.openDialog("Congratulations!", "GPA has been updated successfully!");
      }
    });
  }
  isReadFileModalOpen = false;

  async openReadFileModal() {
    const semesterPattern = /^ki[1-2]-\d{4}-\d{4}$/;
    if (!semesterPattern.test(this.semester)) {
      await this.openDialog("Warning", "Please check your semester data (example: ki2-2023-2024)");
      this.isReadFileModalOpen = false;
      return; // Ngừng thực hiện nếu không hợp lệ
    }
    this.isReadFileModalOpen = true;
  }

  closeReadFileModal() {
    this.isReadFileModalOpen = false;
  }

  async confirmReadFile() {
    this.closeReadFileModal();
    await this.onComplete();
    await this.readFile(); // Gọi hàm đọc file chính
    await this.openDialog("Congratulations!", "The file has been read successfully!");
  }
}
