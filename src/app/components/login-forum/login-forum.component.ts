import {Component, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {UserService} from "../services/user.service";
import {LoginDto} from "../dtos/login.dto";
import {AuthService} from "../services/auth.service";
import {DialogComponent} from "../dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {EventDialogComponent} from "../event-dialog/event-dialog.component";
import {SignupDto} from "../dtos/signup.dto";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {PostService} from "../services/post.service";
import {CommentService} from "../services/comment.service";
import {UpdateDataDto} from "../dtos/update.data.dto";
import {debounceTime, distinctUntilChanged} from "rxjs";

// @ts-ignore
@Component({
  selector: 'app-login-forum',
  templateUrl: './login-forum.component.html',
  styleUrls: ['./login-forum.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('0.5s ease', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class LoginForumComponent implements OnInit{
  secretKey: string = 'javax.crypto.spec.SecretKeySpec@17834';
  loginDTO: LoginDto = {
    username: '',
    password: ''
  }
  user_id: string = '';
  signUpDTO = { username: '', email: '', password: '', confirmPassword: '' };
  registerDTO: SignupDto = {
    email: this.signUpDTO.email,
    username: this.signUpDTO.username,
    password: this.signUpDTO.password
  }
  currentPage = 0;
  comments: any[] = [];
  totalPages = 0;
  newPostContent: string = '';
  posts: any[] = [];
  pages: number[] = [];
  currentUserName: string = '';
  forumItems = [
    {
      post_id: '',
      title: 'Http client post raw content',
      content: 'ciungulete replied 7 hours ago',
      image_url: 'https://img.icons8.com/?size=100&id=aVI7R6wBB2ge&format=png&color=000000',
      replies: 2,
      created_at: new Date(),
      author_name: 'Hai Code Dao',
      views: 32
    },
    // Add more items as needed
  ];
  createNewComment = {
    post_id: '',
    content: '',
    author_id: ''
  }
  createNewPost = {
    title: '',
    content: '',
    author_id: ''
  }
  updateDTO: UpdateDataDto = {
    id: '',
    content: ''
  }
  updatePostData: UpdateDataDto = {
    id:'',
    content: ''
  }
  isEditing: boolean = false; // Biến để kiểm tra chế độ chỉnh sửa
  searchTerm: string = ''; // Biến để lưu giá trị tìm kiếm
  activeClass = 'allThreads';
  async setActive(className: string, event: Event): Promise<void> {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của liên kết
    // if (this.activeClass==='allThreads'){
    //   this.loadPosts();
    // }
    // if (this.activeClass==='popularThisWeek'){
    //   await this.popularThisWeek();
    // }
    // if (this.activeClass==='popularAllTime'){
    //   await this.popularAllTimes();
    // }
    // if (this.activeClass==='noRepliesYet'){
    //   await this.noReplies();
    // }
    // Cập nhật lớp active
    this.currentPage = 0;
    this.activeClass = className;
  }
  async popularThisWeek(){
    const response = await this.postService.popularThisWeek(this.currentPage).toPromise();
    this.forumItems = response.post_response.map((item: any) => ({
      ...item,
      created_at: this.formatDateFromArray(item.created_at), // Convert and format the date array,
    }));
    this.totalPages = response.total_pages;

    this.pages = Array.from({ length: this.totalPages }, (_, i) => i);
  }
  async popularAllTimes(){
    const response = await this.postService.popularAllTimes(this.currentPage).toPromise();
    this.forumItems = response.post_response.map((item: any) => ({
      ...item,
      created_at: this.formatDateFromArray(item.created_at), // Convert and format the date array,
    }));
    this.totalPages = response.total_pages;

    this.pages = Array.from({ length: this.totalPages }, (_, i) => i);
  }
  async noReplies(){
    const response = await this.postService.noReplies(this.currentPage).toPromise();
    this.forumItems = response.post_response.map((item: any) => ({
      ...item,
      created_at: this.formatDateFromArray(item.created_at), // Convert and format the date array,
    }));
    this.totalPages = response.total_pages;
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i);
  }
  constructor(
    private route:ActivatedRoute,
    private http: HttpClient, private router: Router,
    private userService: UserService,
    protected authService: AuthService,
    private dialog: MatDialog,
    private postService: PostService,
    private commentService: CommentService
  ) {
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const userId = params['userId'];
      const type = params['type'];
      const username = params['username'];
      const password = params['password'];
      if (token) {
        this.authService.saveToken(token);
        this.authService.saveUserId(userId)
        this.authService.saveUserName(username);
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
        // const onClose = () => {
        //   // Reload lại trang và xóa bỏ các query parameters
        //   window.location.replace(window.location.pathname);
        // };
        if (username && username.length>5) {
          this.openDialog("Login Successfully!", `Your account data:\nusername:${username}\npassword:${password}`);
        } else
        {
          this.openDialog("Login Successfully!", `Please enjoy your time!`);
        }
      }
    });
    if (this.authService.getToken())  this.loadPosts();
    const username: string | null = this.authService.getUserName();
    if (username !== null) {
      this.currentUserName = username;
    }
    const userId: string | null = this.authService.getUserId();
    if (userId !== null) {
      this.user_id = userId;
    }
  }
  isLogin = true;
  currentScrollPosition: number = 0;
  changePage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      debugger;
      this.currentPage = page;
      if (this.activeClass==='allThreads'){
        this.loadPosts();
      } else {
        if (this.activeClass==='popularThisWeek'){
          this.popularThisWeek();
        }
        else {
          if (this.activeClass==='popularAllTime'){
            this.popularAllTimes();
          } else {
            if (this.activeClass==='noRepliesYet'){
              this.noReplies();
            }
          }
        }
      }
    }
  }
  loadPosts() {
    this.postService.collectData(this.currentPage).subscribe(response => {
      this.forumItems = response.post_response.map((item: any) => ({
        ...item,
        created_at: this.formatDateFromArray(item.created_at), // Convert and format the date array,
      }));
      this.totalPages = response.total_pages;

      this.pages = Array.from({ length: this.totalPages }, (_, i) => i);
    });
  }
  showLogin() {
    this.isLogin = true;
  }
  async fetchProfileData() {
      const data = await this.userService.viewProfile(this.authService.getUserId()).toPromise();
      if (data.username == null || data.username === 'null') {
        await this.openDialog("Warning", "Do not touch to users data");
        return;
      }
      debugger;
      // Điều hướng đến trang view/profile với dữ liệu profile
      this.router.navigate(['view/profile'], { state: { profileData: data } });
  }
  showSignUp() {
    this.isLogin = false;
  }
  updatePagesArray() {
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i);
  }
  isFirstPage(): boolean {
    return this.currentPage === 0;
  }

  isLastPage(): boolean {
    return this.currentPage === this.totalPages - 1;
  }
  openDialogUrl(title: string, message: string, onClose: () => void): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { title, message },
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(() => {
      onClose(); // Gọi callback khi dialog đóng
    });
  }
  openDialog(title: string, message: string): Promise<void> {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { title, message },
      width: '400px'
    });

    return dialogRef.afterClosed().toPromise();
  }
  onSearch(): void {
    if (this.searchTerm.length > 2) { // Chỉ tìm kiếm khi có ít nhất 3 ký tự
      this.postService.searchPosts(this.searchTerm, this.currentPage).pipe(
        debounceTime(300), // Giảm số lần request bằng cách đợi 300ms sau khi người dùng ngừng gõ
        distinctUntilChanged() // Chỉ thực hiện khi giá trị searchTerm thay đổi
      ).subscribe(response => {
        this.forumItems = response.post_response.map((item: any) => ({
          ...item,
          created_at: this.formatDateFromArray(item.created_at), // Convert and format the date array,
        }));
        this.totalPages = response.total_pages;

        this.pages = Array.from({ length: this.totalPages }, (_, i) => i);
      });
    } else {
      this.loadPosts(); // Nếu không có từ khóa tìm kiếm, hiển thị tất cả post
    }
  }
  async loginRequest(){
    debugger
    const data = await this.userService.login(this.loginDTO).toPromise();
    if (data.status==='200'){
      this.authService.saveToken(data.token);
      this.authService.saveUserId(data.id);
      this.authService.saveUserName(data.username);
      await this.openDialog("Login Successfully!", "Please enjoy your time!");
      window.location.reload();
    } else {
      if (data.status==='403'){
        await this.openDialog("Warning", "Login failed, please check your information again!");
      }
    }
  }
  async signUpRequest() {
    if (!(this.signUpDTO.password===this.signUpDTO.confirmPassword)){
      await this.openDialog("Warning", "Please check your information again!");
      return;
    }
    if (this.signUpDTO.username.length<6){
      await this.openDialog(
        "Warning", "Your username length must be greater than 6"
      );
      return;
    }
    if (this.signUpDTO.password.length<8){
      await this.openDialog(
        "Warning", "Your password length must be greater than 8"
      );
      return;
    }
    const data = await this.userService.checkUserName(this.signUpDTO.username).toPromise();
    if (data.username===null||data.username==='null'){
      this.registerDTO = {
        password: this.signUpDTO.password,
        email: this.signUpDTO.email,
        username: this.signUpDTO.username
      }
      const query = await this.userService.signUp(this.registerDTO).toPromise();
      await this.openDialog(
        "Congratulations!", "Your data has been added in system!"
      );
      this.isLogin = !this.isLogin;
      return;
    }
    await this.openDialog(
      "Warning", "Username has been contained in system!"
    );
  }
  loginWithGoogle(){
      window.location.href = "http://localhost:8080/oauth2/authorization/google";
  }
  handleOAuth2Callback(): void {
    const url = new URL(window.location.href);
    const token = url.searchParams.get('token');
    if (token) {
      // Lưu token vào localStorage hoặc sessionStorage
      this.authService.saveToken(token);
      this.router.navigate(['/login/forum']);
    }
  }
  loginWithFacebook(){
    window.location.href = "http://localhost:8080/oauth2/authorization/facebook";
  }
  loginWithGithub(){
    window.location.href = "http://localhost:8080/oauth2/authorization/github";
  }
  async signOut(){
    this.userService.logoutOauth2Google().toPromise();
    this.authService.clearToken();
    this.authService.clearUserId();
    this.router.navigate(['/login/forum']);
    this.userService.logoutOauth2Google2().toPromise();
  }
  createPost() {
    if (this.newPostContent.trim()) {
      const newPost = {
        id: this.posts.length + 1,
        username: this.authService.getToken(), // Placeholder for username
        content: this.newPostContent,
        likes: 0,
        comments: [],
        showComments: false,
        newComment: ''
      };
      this.posts.push(newPost);
      this.newPostContent = '';
    }
  }
  // decryptToken(encryptedToken: string): string {
  //   const bytes = CryptoJS.AES.decrypt(encryptedToken, this.secretKey);
  //   const originalToken = bytes.toString(CryptoJS.enc.Utf8);
  //   return originalToken;
  // }
  likePost(postId: number) {
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.likes++;
    }
  }

  formatDate(date: Date): string {
    const hours = this.padZero(date.getHours());
    const minutes = this.padZero(date.getMinutes());
    const day = this.padZero(date.getDate());
    const month = this.padZero(date.getMonth() + 1); // Months are zero-based
    const year = date.getFullYear();

    return `${hours}:${minutes} ${day}/${month}/${year}`;
  }

  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
  formatDateFromArray(dateArray: number[]): string {
    if (dateArray.length !== 6) {
      return 'Invalid date';
    }

    const [year, month, day, hour, minute, second] = dateArray;
    const date = new Date(year, month - 1, day, hour, minute, second); // Month is zero-based in JS

    return this.formatDate(date);
  }
  temp = [
    { title: 'Bài post 1', excerpt: 'Tóm tắt bài post 1', content: 'Nội dung chi tiết bài post 1' },
    { title: 'Bài post 2', excerpt: 'Tóm tắt bài post 2', content: 'Nội dung chi tiết bài post 2' }
    // Thêm các bài post khác ở đây
  ];
  currentPostId: any;
  selectedPost: any = null;
  async openPost(post: any) {
    this.postService.increaseView(post.post_id).toPromise();
    this.selectedPost = post;
    this.isEditing = false;
    this.currentPostId = post.post_id;
    const data = await this.getCommentsByPostId(post.post_id);  // Lấy bình luận cho bài viết
    debugger;
  }

  closePostDetail() {
    this.selectedPost = null;
    this.comments = [];
  }
  convertToDate(createdAtArray: number[]): Date {
    return new Date(createdAtArray[0], createdAtArray[1] - 1, createdAtArray[2], createdAtArray[3], createdAtArray[4], createdAtArray[5]);
  }
  async loadPostsDecrease(){
    this.postService.collectDataReverse(this.currentPage).subscribe(response => {
      this.forumItems = response.post_response.map((item: any) => ({
        ...item,
        created_at: this.formatDateFromArray(item.created_at), // Convert and format the date array,
      }));
      this.totalPages = response.total_pages;

      this.pages = Array.from({ length: this.totalPages }, (_, i) => i);
    });
  }
  onFilterChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;

    if (selectedValue === 'latest') {
      this.loadPosts(); // Load bài viết mới nhất
    } else if (selectedValue === 'oldest') {
      this.loadPostsDecrease(); // Load bài viết cũ nhất
    } else if (selectedValue === 'popular') {
      this.loadPopularPosts(); // Giả sử bạn có phương thức load các bài viết phổ biến
    }
  }
  async loadPopularPosts() {
    this.postService.collectPopularData(this.currentPage).subscribe(response => {
      this.forumItems = response.post_response.map((item: any) => ({
        ...item,
        created_at: this.formatDateFromArray(item.created_at), // Convert and format the date array,
      }));
      this.totalPages = response.total_pages;

      this.pages = Array.from({ length: this.totalPages }, (_, i) => i);
    });
  }

  async getCommentsByPostId(postId: string) {
    const data = await this.commentService.collectData(postId).toPromise();
    this.comments = data;
    this.comments = data.map((comment: any) => ({
      ...comment,
      created_at: this.formatDateFromArray(comment.created_at), // Convert to Date object,
      created_at_millis: this.dateArrayToMillis(comment.created_at) // Chuyển đổi mảng ngày thành milliseconds
    }));
    // Sắp xếp mảng bình luận từ mới nhất đến cũ nhất
    this.comments.sort((a, b) => b.created_at_millis - a.created_at_millis);

    // Xóa thuộc tính tạm thời nếu không còn cần thiết
    this.comments = this.comments.map(({ created_at_millis, ...rest }) => rest);
    debugger;
  }
  dateArrayToMillis(dateArray: number[]): number {
    if (dateArray.length !== 6) {
      return 0; // Hoặc giá trị mặc định nếu ngày không hợp lệ
    }

    const [year, month, day, hour, minute, second] = dateArray;
    // Tạo mốc thời gian milliseconds từ mảng ngày
    return new Date(year, month - 1, day, hour, minute, second).getTime();
  }
  newComment: string = '';

  sortCommentsByDate() {
    this.comments.sort((a, b) => {
      const dateA = this.convertToDate(a.created_at);
      const dateB = this.convertToDate(b.created_at);
      return dateB.getTime() - dateA.getTime();  // Sắp xếp giảm dần theo thời gian
    });
  }
  async addComment() {
    if (this.newComment.trim()) {
      const now = new Date();
      this.createNewComment = {
        author_id: this.user_id,
        content: this.newComment,
        post_id: this.selectedPost.post_id
      }
      const data = await this.commentService.createComment(this.createNewComment).toPromise();
      const newCommentData = {
        comment_id: data.comment_id,
        post_id: this.selectedPost.id,
        content: data.content,
        author_name: data.author_name,  // Tên người dùng hiện tại
        avatar: data.avatar,  // Avatar người dùng
        created_at: data.created_at // Thay thế bằng thời gian hiện tại
      };
      const today = [
        now.getFullYear(),
        now.getMonth() + 1, // Month is 0-based, so add 1
        now.getDate(),
        now.getHours(),
        now.getMinutes(),
        now.getSeconds()
      ];
      newCommentData.created_at = this.dateArrayToMillis(today);

      // Thêm bình luận vào đầu mảng
      this.comments.unshift(newCommentData);
      // Sắp xếp bình luận từ mới nhất đến cũ nhất
      this.sortCommentsByDate();

      // Xóa nội dung bình luận mới sau khi thêm
      this.newComment = '';
      await this.openDialog("Comment has been posted successfully!", "Enjoy your time!");
    }
  }
  editPost(postId: number, content: string): void {
    // Xử lý logic chỉnh sửa bài viết
    this.updatePostData.id = postId+"";
    this.updatePostData.content = content;
    console.log('Edit post');
  }

  async deletePost(): Promise<void> {
    const data = await this.postService.deletePost(this.selectedPost.post_id).toPromise();
    if (data.status!=='200'){
      await this.openDialog(
        "Warning", "Can not delete post right now!"
      );
    } else {
      await this.openDialog("The post has been deleted successfully","Enjoy your time!");
    }
    this.selectedPost = null;
    window.location.reload();
    console.log('Delete post');
  }
  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  // Hàm để cập nhật bài viết
  async updatePost() {
    if (this.selectedPost) {
      this.updatePostData.id = this.selectedPost.post_id;
      this.updatePostData.content = this.selectedPost.content;
      const data = await this.postService.updatePost(this.updatePostData).toPromise();
      if (data.status!=='200'){
        await this.openDialog(
          "Warning", "Can not update post right now!"
        );
      } else {
        await this.openDialog("The post has been updated successfully","Enjoy your time!");
      }
      console.log('OK button clicked');
      this.toggleEdit(); // Tắt chế độ chỉnh sửa sau khi cập nhật
    }
  }
  editCommentId: number | null = null;
  editingCommentId: number | null = null; // ID của bình luận đang được chỉnh sửa
  editCommentContent: string = ''; // Nội dung bình luận đang được chỉnh sửa

  // Xác định bình luận nào đang được chỉnh sửa
  isEditingComment(commentId: number): boolean {
    return this.editCommentId === commentId;
  }

  // Bắt đầu chế độ chỉnh sửa bình luận
  editComment(commentId: number, content: string): void {
    this.editCommentId = commentId;
    this.editCommentContent = content;
  }

  // Lưu bình luận đã chỉnh sửa
  async saveEditComment(commentId: number): Promise<void> {
    // Tìm bình luận để cập nhật nội dung
    const comment = this.comments.find(c => c.comment_id === commentId);
    if (comment) {
      comment.content = this.editCommentContent;
      this.updateDTO.id = comment.comment_id;
      this.updateDTO.content = comment.content;
      const data = await this.commentService
                    .updateComment(this.updateDTO).toPromise();
      if (data.status!=='200'){
        await this.openDialog(
          "Warning", "Can not update comment right now!"
        );
      } else {
        await this.openDialog("The comment has been updated successfully","Enjoy your time!");
      }
    }
    // Reset trạng thái chỉnh sửa
    this.editCommentId = null;
    this.editCommentContent = '';
  }

  // Xóa bình luận
  async deleteComment(commentId: number): Promise<void> {
    // Xử lý xóa bình luận
    this.comments = this.comments.filter(comment => comment.comment_id !== commentId);
    const data = await this.commentService.deleteComment(commentId).toPromise();
    if (data.status!=='200'){
      await this.openDialog(
        "Warning", "Can not delete comment right now!"
      );
    } else {
      await this.openDialog("The comment has been deleted successfully","Enjoy your time!");
    }
  }
  showModal: boolean = false;
  title: string = '';
  content: string = '';

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  async submit() {
    // Xử lý khi người dùng gửi biểu mẫu
    this.createNewPost = {
      title: this.title,
      content: this.content,
      author_id: this.user_id
    }
    const data = await this.postService.createPost(this.createNewPost).toPromise();
    await this.openDialog("Your post has been created", "Enjoy your time!");
    this.loadPosts();
    this.title = '';
    this.content = '';
    this.closeModal();
  }
  maxLength = 100;

  // Kiểm tra xem nội dung bình luận có dài hơn maxLength không
  isLongComment(content: string): boolean {
    return content.length > this.maxLength;
  }

  // Cắt bớt nội dung để hiển thị phần đầu và phần "Show more"
  getShortContent(content: string): string {
    return content.length > this.maxLength ? content.substring(0, this.maxLength) + '...' : content;
  }
  showMoreComments = new Set<number>();

  toggleShowMore(commentId: number) {
    if (this.showMoreComments.has(commentId)) {
      this.showMoreComments.delete(commentId);
    } else {
      this.showMoreComments.add(commentId);
    }
  }
}
