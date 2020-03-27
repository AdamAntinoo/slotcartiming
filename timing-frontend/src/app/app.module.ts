import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
// - COMPONENTS
import { AppComponent } from './app.component';
import { LaneTimingPanelComponent } from './panels/lane-timing-panel/lane-timing-panel.component';
import { MenuBarComponent } from './panels/menu-bar/menu-bar.component';
import { SessionTimerComponent } from './panels/session-timer/session-timer.component';
// - SERVICES
import { DSPusherService } from './services/dspusher.service';

import { SpeechSynthesisModule } from '@kamiazya/ngx-speech-synthesis';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs, 'es-ES');

@NgModule({
    declarations: [
        AppComponent,
        LaneTimingPanelComponent,
        MenuBarComponent,
        SessionTimerComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        SpeechSynthesisModule.forRoot({
            lang: 'es',
            volume: 1.0,
            pitch: 1.0,
            rate: 1.2,
        })
    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'es-ES' },
        DSPusherService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
