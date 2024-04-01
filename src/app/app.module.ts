import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
 
 //import { SidebarFrontComponent } from './FrontOffice/sidebar-front/sidebar-front.component';
 
 


import { ScheduleModule, RecurrenceEditorModule } from '@syncfusion/ej2-angular-schedule';
import { DropDownListModule, ComboBoxModule, AutoCompleteModule, MultiSelectModule, ListBoxModule, DropDownTreeModule, MentionModule } from '@syncfusion/ej2-angular-dropdowns';
import { TextBoxModule, NumericTextBoxModule, MaskedTextBoxModule, SliderModule, UploaderModule, ColorPickerModule, SignatureModule, RatingModule } from '@syncfusion/ej2-angular-inputs';
import { ButtonModule, CheckBoxModule, RadioButtonModule, SwitchModule, ChipListModule, FabModule, SpeedDialModule } from '@syncfusion/ej2-angular-buttons';
import { AccordionModule, ToolbarModule, ContextMenuModule, BreadcrumbModule, CarouselModule, TabModule, TreeViewModule, SidebarModule, MenuModule, AppBarModule, StepperModule } from '@syncfusion/ej2-angular-navigations';




import { FullCalendarModule } from '@fullcalendar/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 import { FormsModule } from '@angular/forms';



import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';



import { HttpClientModule } from '@angular/common/http';
import { ElderlyDashboardComponent } from './FrontOffice/pages2/elderly-dashboard/elderly-dashboard.component';
import { DoctorProfileComponent } from './FrontOffice/pages2/doctor-profile/doctor-profile.component';
import { CalendarComponent } from './FrontOffice/pages2/calendar/calendar.component';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { PendingAppointmentsComponent } from './FrontOffice/pages2/pending-appointments/pending-appointments.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedService } from './FrontOffice/services2/shared.service';
import { CalendarDoctorComponent } from './FrontOffice/pages2/calendar-doctor/calendar-doctor.component';
import { SearchFilterPipe } from './FrontOffice/pages2/search-filter.pipe';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { BookingComponent } from './FrontOffice/pages2/booking/booking.component';
import { MapPopupComponent } from './FrontOffice/pages2/map-popup/map-popup.component';
import { MapDisplayComponent } from './FrontOffice/pages2/map-display/map-display.component';
import { ImagePopupComponent } from './FrontOffice/pages2/image-popup/image-popup.component';
import { MatIconModule } from '@angular/material/icon';
import { DoctorDashboardComponent } from './FrontOffice/pages2/doctor-dashboard/doctor-dashboard.component';
import { AllTemplateFrontOumaymaComponent } from './FrontOffice/oumayma/all-template-front-oumayma/all-template-front-oumayma.component';
import { HeaderFrontOumaymaComponent } from './FrontOffice/oumayma/header-front-oumayma/header-front-oumayma.component';
import { HomeFrontOumaymaComponent } from './FrontOffice/oumayma/home-front-oumayma/home-front-oumayma.component';
import { FooterFrontOumaymaComponent } from './FrontOffice/oumayma/footer-front-oumayma/footer-front-oumayma.component'; // Import MatIconModule






import { AllTemplateBackComponent } from './BackOffice/all-template-back/all-template-back.component';
import { FooterBackComponent } from './BackOffice/footer-back/footer-back.component';
import { NavbarBackComponent } from './BackOffice/navbar-back/navbar-back.component';
import { SidebarBackComponent } from './BackOffice/sidebar-back/sidebar-back.component';
import { AllTemplateFrontComponent } from './FrontOffice/Auth+shop/all-template-front/all-template-front.component';
//import { SidebarFrontComponent } from './FrontOffice/sidebar-front/sidebar-front.component';
import { FooterFrontComponent } from './FrontOffice/Auth+shop/footer-front/footer-front.component';
import { HeaderFrontComponent } from './FrontOffice/Auth+shop/header-front/header-front.component';
import { HomeFrontComponent } from './FrontOffice/Auth+shop/home-front/home-front.component';
import { HomeBackComponent } from './BackOffice/home-back/home-back.component';
import { ListUserComponent } from './BackOffice/list-user/list-user.component';
import { ListArchiveComponent } from './BackOffice/list-archive/list-archive.component';
import { ListDoctorComponent } from './BackOffice/list-doctor/list-doctor.component';
import { SignComponent } from './FrontOffice/Auth+shop/sign/sign.component';
import { SigninComponent } from './FrontOffice/Auth+shop/signin/signin.component';
import { UpdateUserComponent } from './FrontOffice/Auth+shop/update-user/update-user.component';
import { RoleStatisticsComponent } from './BackOffice/role-statistics/role-statistics.component';
import { ListElderlyComponent } from './BackOffice/list-elderly/list-elderly.component';
import { ListAmbulanceDriverComponent } from './BackOffice/list-ambulance-driver/list-ambulance-driver.component';
import { ListAmbulanceOwnerComponent } from './BackOffice/list-ambulance-owner/list-ambulance-owner.component';
import { ListNurseComponent } from './BackOffice/list-nurse/list-nurse.component';
import { DoctorComponent } from './FrontOffice/Auth+shop/doctor/doctor.component';
import { ElderlyComponent } from './FrontOffice/Auth+shop/elderly/elderly.component';
import { AmbulanceDriverComponent } from './FrontOffice/Auth+shop/ambulance-driver/ambulance-driver.component';
import { AmbulanceOwnerComponent } from './FrontOffice/Auth+shop/ambulance-owner/ambulance-owner.component';
import { NurseComponent } from './FrontOffice/Auth+shop/nurse/nurse.component';
import { SideshopbackComponent } from './FrontOffice/Auth+shop/shopfront/shopback/sideshopback/sideshopback.component';
import { NavshopbackComponent } from './FrontOffice/Auth+shop/shopfront/shopback/navshopback/navshopback.component';
import { HomeshopbackComponent } from './FrontOffice/Auth+shop/shopfront/shopback/homeshopback/homeshopback.component';
import { BackfooterComponent } from './FrontOffice/Auth+shop/shopfront/shopback/backfooter/backfooter.component';
import { AlltempbackComponent } from './FrontOffice/Auth+shop/shopfront/shopback/alltempback/alltempback.component';
import { HomeshopComponent } from './FrontOffice/Auth+shop/shopfront/templatehazem/homeshop/homeshop.component';
import { AddProductComponent } from './FrontOffice/Auth+shop/shopfront/add-product/add-product.component';
import { AdminarchivelistComponent } from './FrontOffice/Auth+shop/shopfront/adminarchivelist/adminarchivelist.component';
import { CardModalComponent } from './FrontOffice/Auth+shop/shopfront/card-modal/card-modal.component';
import { ElderlyCartComponent } from './FrontOffice/Auth+shop/shopfront/elderly-cart/elderly-cart.component';
import { ElderlyOrderInfoComponent } from './FrontOffice/Auth+shop/shopfront/elderly-order-info/elderly-order-info.component';
import { PaymentFormComponentComponent } from './FrontOffice/Auth+shop/shopfront/payment-form-component/payment-form-component.component';
import { ProductEditComponent } from './FrontOffice/Auth+shop/shopfront/product-edit/product-edit.component';
import { ProductdetailsComponent } from './FrontOffice/Auth+shop/shopfront/productdetails/productdetails.component';
import { ProductlistComponent } from './FrontOffice/Auth+shop/shopfront/productlist/productlist.component';
import { ProductlistclientComponent } from './FrontOffice/Auth+shop/shopfront/productlistclient/productlistclient.component';
import { AlltemplatesfontComponent } from './FrontOffice/Auth+shop/shopfront/templatehazem/alltemplatesfont/alltemplatesfontshop.component';
import { FooterfrontComponent } from './FrontOffice/Auth+shop/shopfront/templatehazem/footerfront/footerfront.component';
import { HeadertempComponent } from './FrontOffice/Auth+shop/shopfront/templatehazem/headertemp/headertemp.component';
import { AddAmbulanceComponent } from './FrontOffice/Ambulance/add-ambulance/add-ambulance.component';
import { AddDriverComponent } from './FrontOffice/Ambulance/add-driver/add-driver.component';
import { AfficheDriverComponent } from './FrontOffice/Ambulance/affiche-driver/affiche-driver.component';
import { AfficheOwnerComponent } from './FrontOffice/Ambulance/affiche-owner/affiche-owner.component';
import { AfficheAmbulanceComponent } from './FrontOffice/Ambulance/affiche-ambulance/affiche-ambulance.component';
import { DeleteAmbulanceComponent } from './FrontOffice/Ambulance/delete-ambulance/delete-ambulance.component';
import { GetAllAmbulanceComponent } from './FrontOffice/Ambulance/get-all-ambulance/get-all-ambulance.component';
import { UpdateAmbulanceComponent } from './FrontOffice/Ambulance/update-ambulance/update-ambulance.component';
import { AllTemplateNadhirComponent } from './FrontOffice/Ambulance/all-template-nadhir/all-template-nadhir.component';
import { FooterTemplateNadhirComponent } from './FrontOffice/Ambulance/footer-template-nadhir/footer-template-nadhir.component';
import { HeaderTemplateNadhirComponent } from './FrontOffice/Ambulance/header-template-nadhir/header-template-nadhir.component';
import { HomeTemplateNadhirComponent } from './FrontOffice/Ambulance/home-template-nadhir/home-template-nadhir.component';
import { ChatComponent } from './FrontOffice/chat/chat.component';
import { FilterByRolePipe } from './filter-by-role.pipe';
import { ListRelativeComponent } from './BackOffice/list-relative/list-relative.component';
import { ElderlyprofileComponent } from './FrontOffice/Auth+shop/shopfront/elderlyprofile/elderlyprofile.component';
import { ProfildoctorComponent } from './FrontOffice/pages2/profildoctor/profildoctor.component';
import { ProfilenurseComponent } from './FrontOffice/Auth+shop/profilenurse/profilenurse.component';
import { ProfiledriverComponent } from './FrontOffice/Auth+shop/profiledriver/profiledriver.component';
import { AllTemplateRelativeComponent } from './FrontOffice/Ambulance/all-template-relative/all-template-relative.component';
import { HeaderTemplateRelativeComponent } from './FrontOffice/Ambulance/header-template-relative/header-template-relative.component';
import { ProfiledownerComponent } from './FrontOffice/Auth+shop/profiledowner/profiledowner.component';
import { ProfilerelativeComponent } from './FrontOffice/Auth+shop/profilerelative/profilerelative.component';



@NgModule({
  declarations: [
    
    AppComponent,
 
  
    SidebarBackComponent,
    AllTemplateBackComponent,
    FooterBackComponent,
    NavbarBackComponent,
    SidebarBackComponent,
    AllTemplateFrontComponent,
  //  SidebarFrontComponent,
    FooterFrontComponent,
    HeaderFrontComponent,
    HomeFrontComponent,
    HomeBackComponent,
    SidebarBackComponent,
    FooterBackComponent,
    NavbarBackComponent,
    ListUserComponent,
    ListArchiveComponent,
    ListDoctorComponent,
    SignComponent,
    SigninComponent,
    UpdateUserComponent,
    RoleStatisticsComponent,
    ListElderlyComponent,
    ListAmbulanceDriverComponent,
    ListAmbulanceOwnerComponent,
    ListNurseComponent,
    DoctorComponent,
    ElderlyComponent,
    AmbulanceDriverComponent,
    AmbulanceOwnerComponent,
    NurseComponent,
    
    
    AddProductComponent,
    ProductlistComponent,
    ProductEditComponent,
    ProductlistclientComponent,
    ProductdetailsComponent,
    ElderlyCartComponent,
    AdminarchivelistComponent,
    CardModalComponent,
    PaymentFormComponentComponent,
    ElderlyOrderInfoComponent,
    AlltemplatesfontComponent,
    FooterfrontComponent,
    HeadertempComponent,
    HomeshopComponent,
    AlltempbackComponent,
    BackfooterComponent,
    HomeshopbackComponent,
    NavshopbackComponent,
    SideshopbackComponent,
    
    
    
    
    
    //oumayma
    CalendarComponent,
    ElderlyDashboardComponent,
    DoctorProfileComponent,
    PendingAppointmentsComponent,
    CalendarDoctorComponent,
    SearchFilterPipe,
    MapPopupComponent,
    MapDisplayComponent,
    ImagePopupComponent,
    DoctorDashboardComponent,
    AllTemplateFrontOumaymaComponent,
    HeaderFrontOumaymaComponent,
    HomeFrontOumaymaComponent,
    FooterFrontOumaymaComponent,
    AddAmbulanceComponent,
    AddDriverComponent,
    AfficheDriverComponent,
    AfficheOwnerComponent,
    AfficheAmbulanceComponent,
    DeleteAmbulanceComponent,
    GetAllAmbulanceComponent,
    UpdateAmbulanceComponent,
    AllTemplateNadhirComponent,
    FooterTemplateNadhirComponent,
    HeaderTemplateNadhirComponent,
    HomeTemplateNadhirComponent,
    ChatComponent,
    FilterByRolePipe,
    ListRelativeComponent,
    ElderlyprofileComponent,
    ProfildoctorComponent,
    ProfilenurseComponent,
    ProfiledriverComponent,
    AllTemplateRelativeComponent,
    HeaderTemplateRelativeComponent,
    ProfiledownerComponent,
    ProfilerelativeComponent


  ],
  imports: [
    MatIconModule,
    HttpClientModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,


    ScheduleModule, RecurrenceEditorModule, DropDownListModule, ComboBoxModule, AutoCompleteModule, MultiSelectModule, ListBoxModule, DropDownTreeModule, MentionModule, TextBoxModule, NumericTextBoxModule, MaskedTextBoxModule, SliderModule, UploaderModule, ColorPickerModule, SignatureModule, RatingModule, ButtonModule, CheckBoxModule, RadioButtonModule, SwitchModule, ChipListModule, FabModule, SpeedDialModule, AccordionModule, ToolbarModule, ContextMenuModule, BreadcrumbModule, CarouselModule, TabModule, TreeViewModule, SidebarModule, MenuModule, AppBarModule, StepperModule,
    FullCalendarModule,
    BrowserAnimationsModule,    MatDialogModule,  ReactiveFormsModule
    
  
  ],
  providers: [SharedService,MatDialog,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} } 
],
  bootstrap: [AppComponent]
})
export class AppModule { }
