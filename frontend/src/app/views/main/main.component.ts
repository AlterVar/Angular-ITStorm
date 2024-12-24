import { Component, OnInit } from '@angular/core';
import {OwlOptions, SlideModel, SlidesOutputData} from "ngx-owl-carousel-o";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 24,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      }
    },
    nav: false
  }
  activeSlide: SlideModel = {id: 'slide-1'};

  constructor() { }

  ngOnInit(): void {
  }

  makeActive(data: SlidesOutputData) {
   this.activeSlide = (data.slides && data.slides.length > 0) ? data.slides[0] : {id: 'slide-1'};
  }
}
