import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { supabase } from 'src/app/supabase.client';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Capacitor } from '@capacitor/core';
import {
  IonContent,
  IonButton,
  IonTextarea,
  IonItem,
  IonInput,
  IonAvatar,
  IonLabel,
  IonList,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-blog-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonButton,
    IonTextarea,
    IonItem,
    IonInput,
    IonAvatar,
    IonLabel,
    IonList,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon
  ],
  templateUrl: './blog.page.html',
  styleUrls: ['./blog.page.scss']
})
export class BlogCreatePage implements OnInit {
  userId: string | null = null;
  post = {
    message: '',
    character: null as any,
    gpsUrl: '',
    lat: 0,
    lon: 0,
    photoUrl: ''
  };
  characters: any[] = [];
  characterSearch = '';
  characterLoading = false;

  showPreview = true;

  constructor(private http: HttpClient, private router: Router) { }


  userName: string = '';
  profilePhotoUrl: string = '';

  async ngOnInit() {
    const { data: { session } } = await supabase.auth.getSession();
    this.userId = session?.user?.id ?? null;

    if (this.userId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, photo_url')
        .eq('id', this.userId)
        .single();

      this.userName = profile?.username || 'Invitado';
      this.profilePhotoUrl = profile?.photo_url || '';
    }
  }



  goToBlogFeed() {
    this.router.navigate(['/blog-feed']);
  }


  previewPost() {
    if (!this.post.message) {
      alert("Escribe un mensaje primero");
      return;
    }
    this.showPreview = true;
  }


  async addGPS() {
    try {
      const pos = await Geolocation.getCurrentPosition();
      this.post.lat = pos.coords.latitude;
      this.post.lon = pos.coords.longitude;
      this.post.gpsUrl = `https://www.google.com/maps/search/?api=1&query=${pos.coords.latitude},${pos.coords.longitude}`;
      alert('📍 Ubicación añadida correctamente');
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
      alert('Error al obtener la ubicación');
    }
  }


  async addPhoto() {

    const source = Capacitor.getPlatform() === 'web' ? CameraSource.Photos : CameraSource.Camera;

    try {
      const image = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.DataUrl,
        source: source,
      });

      const blob = this.dataURLtoBlob(image.dataUrl!);
      const fileName = `blog_${Date.now()}.jpg`;

      const { error } = await supabase.storage.from('archivos').upload(fileName, blob, {
        contentType: 'image/jpeg',
        upsert: true
      });

      if (error) {
        console.error('Error al subir la imagen:', error);
        alert('Error al subir la foto');
        return;
      }

      const { data } = supabase.storage.from('archivos').getPublicUrl(fileName);
      this.post.photoUrl = data.publicUrl;
      alert('Foto añadida correctamente');
    } catch (error) {
      console.error('Error tomando o subiendo foto:', error);
      alert('Error al capturar o subir la foto');
    }
  }


  async publish() {
    if (!this.userId || !this.post.message) {
      alert("Falta mensaje o usuario");
      return;
    }

    const { error } = await supabase.from('blog_posts').insert([{
      user_id: this.userId,
      message: this.post.message,
      character_name: this.post.character?.name || null,
      character_image: this.post.character?.image || null,
      gps_url: this.post.gpsUrl,
      latitude: this.post.lat,
      longitude: this.post.lon,
      photo_url: this.post.photoUrl
    }]);

    if (error) {
      alert("Error subiendo publicación: " + error.message);
    } else {
      alert("¡Publicación subida!");
      this.router.navigate(['/blog-feed']);
    }
  }

  dataURLtoBlob(dataUrl: string): Blob {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  }

  async searchCharacters() {
    if (!this.characterSearch.trim()) {
      alert('Escribe un nombre para buscar personajes');
      return;
    }

    this.characterLoading = true;
    try {
      const response: any = await this.http
        .get(`https://rickandmortyapi.com/api/character/?name=${this.characterSearch}`)
        .toPromise();
      this.characters = response.results;
    } catch (error) {
      console.error('Error buscando personajes:', error);
      this.characters = [];
      alert('No se encontraron personajes con ese nombre');
    } finally {
      this.characterLoading = false;
    }
  }
  selectCharacter(char: any) {
    this.post.character = char;
    this.characters = [];
    this.characterSearch = '';
    alert(`Personaje "${char.name}" seleccionado`);
  }

  async changeProfilePhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      const blob = this.dataURLtoBlob(image.dataUrl!);
      const fileName = `profile_${this.userId}_${Date.now()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from('archivos')
        .upload(fileName, blob, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (uploadError) {
        alert("Error subiendo la foto de perfil");
        return;
      }

      const { data } = supabase.storage.from('archivos').getPublicUrl(fileName);
      this.profilePhotoUrl = data.publicUrl;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ photo_url: this.profilePhotoUrl })
        .eq('id', this.userId);

      if (updateError) {
        alert("Error actualizando el perfil");
      } else {
        alert("Foto de perfil actualizada");
      }
    } catch (error) {
      alert("Error al capturar la foto");
      console.error(error);
    }
  }

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("Error al cerrar sesión: " + error.message);
    } else {
      this.router.navigate(['/auth']);
    }
  }
}
