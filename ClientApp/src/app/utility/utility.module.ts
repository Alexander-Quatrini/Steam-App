import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCarouselComponent } from '../image-carousel/image-carousel.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { GameListComponent } from '../game-list/game-list.component';
import { FriendsListComponent } from './friends-list/friends-list.component';


@NgModule({
  declarations: [
    ImageCarouselComponent,
    GameListComponent,
    FriendsListComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  exports:[
    ImageCarouselComponent,
    GameListComponent,
    FriendsListComponent
  ]
})
export class UtilityModule { }
