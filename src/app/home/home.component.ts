import { Component } from '@angular/core';
import { ServicesSlideshowComponent } from '../servicio-slideshow/servicios-slideshow.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [ServicesSlideshowComponent, HeaderComponent, FooterComponent]
})
export class HomeComponent {
  // Este componente representa la página principal.
}