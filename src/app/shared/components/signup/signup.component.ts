import { environment } from './../../../../environments/environment';
import { Angular2TokenService } from 'angular2-token';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  signupForm: FormGroup;

  constructor(private fb: FormBuilder, private authToken: Angular2TokenService) {
    this.signupForm = this.initSignupForm();
  }

  ngOnInit() {
  }

  onCloseModal() {
    this.closeModal.emit(true);
  }

  onSignUp() {
    console.log('signup', this.signupForm.value);
    if (this.signupForm.valid) {
      this.signUp();
    }
  }

  initSignupForm() {
    return this.fb.group({
      'name': ['', Validators.required],
      'email': ['', Validators.required],
      'password': ['', Validators.required],
      'passwordConfirmation': ['', Validators.required]
    });
  }

  signUp()  {
    const credentials = this.signupForm.value;
    this.authToken.init(environment.token_auth_config);
    this.authToken.registerAccount(credentials).subscribe(
      res => {
        this.onCloseModal();
        console.log('auth response:', res);
        console.log('auth response headers: ', res.headers.toJSON());
        console.log('auth response body:', res.json());
      },
      err => {
        console.error('auth error:', err);
      }
    );
  }

}
