import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlogFeedPage } from './blog-feed.page';

describe('BlogFeedPage', () => {
  let component: BlogFeedPage;
  let fixture: ComponentFixture<BlogFeedPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogFeedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
