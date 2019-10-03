import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { LoginComponent } from './login/login.component';
import { MatMenuModule} from '@angular/material/menu';
import { MenuComponent } from './menu/menu.component';
import { HomeComponent } from './home/home.component';
import { MainComponent } from './main/main.component';
import { EvaluacionComponent } from './evaluacion/evaluacion.component';
import { MatCardModule } from '@angular/material';
import { RegisterComponent } from './register/register.component';
import { FooterComponent } from './footer/footer.component';
import { EncabezadoComponent } from './encabezado/encabezado.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { TasksService } from './services/tasks.service';
import { MatTableModule } from '@angular/material';
import { SortexampleComponent } from './sortexample/sortexample.component' 
import { SortablejsModule } from 'angular-sortablejs'
import { DragDropModule } from '@angular/cdk/drag-drop';
import {MatInputModule} from '@angular/material/input';
import {MatExpansionModule} from '@angular/material/expansion';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MenuComponent,
    HomeComponent,
    MainComponent,
    EvaluacionComponent,
    RegisterComponent,
    FooterComponent,
    EncabezadoComponent,
    SortexampleComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatCardModule,
    MatTableModule,
    HttpClientModule,
    DragDropModule,
    MatInputModule,
    MatExpansionModule,
    SortablejsModule.forRoot({})
  ],
  providers: [AuthService,TasksService],
  bootstrap: [AppComponent]
})

export class AppModule { }
