import { ProjectHttpService } from './../../services/http/project-http.service';
import { ProjectActions } from './../../actions/project.actions';
import { ActivatedRoute } from '@angular/router';
import { getSelectedProject } from './../../reducers/project.selector';
import { CommentActions } from './../../actions/comment.actions';
import { Subscription } from 'rxjs/Subscription';
import { Project } from './../../../core/models/project';
import { Observable } from 'rxjs/Observable';
import { AppState } from './../../../app.state';
import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit, OnDestroy {

  projectSub$: Subscription;
  routeSub$: Subscription;
  project: any;
  selectedTab = 1;
  amount: number;

  constructor(
    private store: Store<AppState>,
    private commentActions: CommentActions,
    private route: ActivatedRoute,
    private projectActions: ProjectActions,
    private projectHttpService: ProjectHttpService,
    private sanitizer: DomSanitizer
    ) {
    this.routeSub$ = this.route.params.subscribe((params) => {
      const id = params['id'];
      this.store.dispatch(this.projectActions.fetchProject(id));
    });

    this.projectSub$ = this.store.select(getSelectedProject).subscribe((project) => {
      this.project = project;
    });

    this.loadJWPlayer();
  }

  ngOnInit() {
  }

  changeTab(number) {
    this.selectedTab = number;
  }

  getVideoThumbnail(url) {
    const videoId = this.projectHttpService.getVideoId(url);
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;
    return thumbnailUrl;
  }

  getVideoEmbedUrl(url) {
    const videoId = this.projectHttpService.getVideoId(url);
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    const safeEmbedUrl =  this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    return safeEmbedUrl;
  }

  ngOnDestroy() {
    this.store.dispatch(this.commentActions.clearComments());
    this.projectSub$.unsubscribe();
    this.routeSub$.unsubscribe();
  }

  loadJWPlayer() {
    const playerInstance = jwplayer('myElement');
    playerInstance.setup({
    file: 'https://www.youtube.com/watch?v=KFwjibi-JRU',
    width: 640,
    height: 360
    });
  }

}
