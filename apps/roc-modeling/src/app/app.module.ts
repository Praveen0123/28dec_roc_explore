import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from '@core/core.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from '@shared/shared.module';
import { RootStoreModule } from '@state/root-store.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonUIModule } from './features/common-ui/common-ui.module';
import { GraphQLModule } from './graphql.module';

@NgModule({
  imports:
    [
      BrowserModule.withServerTransition({ appId: 'serverApp' }),
      BrowserAnimationsModule,
      HttpClientModule,

      GraphQLModule,
      FontAwesomeModule,
      AppRoutingModule,
      CommonUIModule,
      CoreModule,
      RootStoreModule,
      SharedModule
    ],
  declarations:
    [
      AppComponent
    ],
  providers: [],
  bootstrap:
    [
      AppComponent
    ],
})
export class AppModule { }
