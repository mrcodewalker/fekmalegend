import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { FileUploadService } from "../services/file.upload.service";
import { FileResponseDto } from "../dtos/file.response.dto";

@Component({
  selector: 'app-file-storage',
  templateUrl: './file-storage.component.html',
  styleUrls: ['./file-storage.component.scss']
})
export class FileStorageComponent implements OnInit {
  files: FileResponseDto[] = [];
  paginatedFiles: FileResponseDto[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;

  constructor(
    private authService: AuthService,
    private fileService: FileUploadService
  ) {}

  ngOnInit() {
    this.collectFiles();
  }

  async collectFiles() {
    const data = await this.fileService.getAllFiles(this.currentPage - 1).toPromise();

    this.files = data.files; // Gán danh sách file
    this.totalPages = data.totalPages; // Gán tổng số trang

  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.collectFiles(); // Gọi lại API để lấy file cho trang mới
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.collectFiles(); // Gọi lại API để lấy file cho trang mới
    }
  }

  downloadFile(fileName: string) {
    const link = document.createElement('a');
    link.href = `http://192.168.1.103:8086/download1?hdfs_path_file=/data/KMA/${fileName}`;
    // link.href = `http://42.112.211.165:8086/download1?file_name=${fileName}&web_name=WEB_KHAO_THI`;
    link.download = fileName;
    link.click();
  }
}
