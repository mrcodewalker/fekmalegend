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
  totalPages = 0;
  newPostContent: string = '';
  posts: any[] = [];
  pages: number[] = [];
  forumItems = [
    {
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
  constructor(
    private route:ActivatedRoute,
    private http: HttpClient, private router: Router,
    private userService: UserService,
    protected authService: AuthService,
    private dialog: MatDialog,
    private postService: PostService
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
    this.loadPosts();
  }
  isLogin = true;
  currentScrollPosition: number = 0;
  changePage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadPosts();
    }
  }
  loadPosts() {
    this.postService.collectData(this.currentPage).subscribe(response => {
      this.forumItems = response.post_response.map((item: any) => ({
        ...item,
        created_at: this.formatDateFromArray(item.created_at), // Convert and format the date array,
        views: 100
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
        this.openDialog("Warning", "Do not touch to users data");
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
  handleEventClick(arg: any) {
    this.currentScrollPosition = window.scrollY;
    this.dialog.open(EventDialogComponent, {
      data: {
        title: arg.event.title,
        description: arg.event.extendedProps.description, // Lấy mô tả từ extendedProps
        start: arg.event.start,
        end: arg.event.end,
      }
    }).afterClosed().subscribe(() => {
      window.scrollTo(0, this.currentScrollPosition);
    });
  }
  async loginRequest(){
    debugger
    const data = await this.userService.login(this.loginDTO).toPromise();
    if (data.status==='200'){
      this.authService.saveToken(data.token);
      this.authService.saveUserId(data.id);
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

}
