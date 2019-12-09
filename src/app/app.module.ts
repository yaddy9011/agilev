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
import { MatMenuModule } from '@angular/material/menu';
import { MenuComponent } from './menu/menu.component';
import { HomeComponent } from './home/home.component';
import { MainComponent } from './main/main.component';
import { EvaluacionComponent, DialogOverviewExampleDialog} from './evaluacion/evaluacion.component';
import { MatCardModule } from '@angular/material';
import { RegisterComponent, PizzaPartyComponent } from './register/register.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { AppGlobals } from './app.global';
import { TasksService } from './services/tasks.service';
import { MatTableModule } from '@angular/material';
import { SortablejsModule } from 'angular-sortablejs'
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { GestionObjetivosComponent } from './gestion-objetivos/gestion-objetivos.component';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MenuComponent,
    HomeComponent,
    MainComponent,
    EvaluacionComponent,
    RegisterComponent,
    PizzaPartyComponent,
    DialogOverviewExampleDialog,
    FooterComponent,
    GestionObjetivosComponent
  ],
  entryComponents: [PizzaPartyComponent, DialogOverviewExampleDialog],
  imports: [
    NgbModule,
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
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTabsModule,
    SortablejsModule.forRoot({})
  ],
  providers: [AuthService, TasksService, AppGlobals],
  bootstrap: [AppComponent]
})

export class AppModule {}
