import { Component, OnInit } from '@angular/core';
import { supabase } from 'src/app/supabase.client';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonAvatar, IonThumbnail, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog-feed',
  templateUrl: './blog-feed.page.html',
  styleUrls: ['./blog-feed.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonAvatar, IonThumbnail, CommonModule, IonButton,]
})
export class BlogFeedPage implements OnInit {
  posts: any[] = [];
  loading = false;

  constructor(private router: Router) { }

  async ngOnInit() {
    await this.loadPosts();
  }

  async loadPosts() {
    this.loading = true;
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
    *,
    profiles:user_id (username)
  `)
      .order('created_at', { ascending: false });


    if (error) {
      alert('Error cargando posts: ' + error.message);
      this.posts = [];
    } else {
      this.posts = data ?? [];
    }
    this.loading = false;
  }

  goToCreate() {
    this.router.navigate(['/blog-create']);
  }
}
