import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCarouselComponent } from '../image-carousel/image-carousel.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { GameListComponent } from '../game-list/game-list.component';


@NgModule({
  declarations: [
    ImageCarouselComponent,
    GameListComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  exports:[
    ImageCarouselComponent,
    GameListComponent
  ]
})
export class UtilityModule { }
