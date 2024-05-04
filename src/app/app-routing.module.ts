import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
 
import { CalendarComponent } from './FrontOffice/pages2/calendar/calendar.component';
import { ElderlyDashboardComponent } from './FrontOffice/pages2/elderly-dashboard/elderly-dashboard.component';
import { DoctorProfileComponent } from './FrontOffice/pages2/doctor-profile/doctor-profile.component';
import { CalendarDoctorComponent } from './FrontOffice/pages2/calendar-doctor/calendar-doctor.component';
import { BookingComponent } from './FrontOffice/pages2/booking/booking.component';
import { DoctorDashboardComponent } from './FrontOffice/pages2/doctor-dashboard/doctor-dashboard.component';
import { HomeFrontOumaymaComponent } from './FrontOffice/oumayma/home-front-oumayma/home-front-oumayma.component';
import { AllTemplateFrontOumaymaComponent } from './FrontOffice/oumayma/all-template-front-oumayma/all-template-front-oumayma.component';
import { ElderlyCartComponent } from './FrontOffice/Auth+shop/shopfront/elderly-cart/elderly-cart.component';
import { ProductlistclientComponent } from './FrontOffice/Auth+shop/shopfront/productlistclient/productlistclient.component';
import { HomeshopComponent } from './FrontOffice/Auth+shop/shopfront/templatehazem/homeshop/homeshop.component';
import { AllTemplateFrontComponent } from './FrontOffice/Auth+shop/all-template-front/all-template-front.component';
import { RoleStatisticsComponent } from './BackOffice/role-statistics/role-statistics.component';
import { ListNurseComponent } from './BackOffice/list-nurse/list-nurse.component';
import { ListAmbulanceOwnerComponent } from './BackOffice/list-ambulance-owner/list-ambulance-owner.component';
import { ListAmbulanceDriverComponent } from './BackOffice/list-ambulance-driver/list-ambulance-driver.component';
import { ListElderlyComponent } from './BackOffice/list-elderly/list-elderly.component';
import { ListDoctorComponent } from './BackOffice/list-doctor/list-doctor.component';
import { ListArchiveComponent } from './BackOffice/list-archive/list-archive.component';
import { ListUserComponent } from './BackOffice/list-user/list-user.component';
import { AllTemplateBackComponent } from './BackOffice/all-template-back/all-template-back.component';
import { ProductdetailsComponent } from './FrontOffice/Auth+shop/shopfront/productdetails/productdetails.component';
import { AddProductComponent } from './FrontOffice/Auth+shop/shopfront/add-product/add-product.component';
import { ProductlistComponent } from './FrontOffice/Auth+shop/shopfront/productlist/productlist.component';
import { ProductEditComponent } from './FrontOffice/Auth+shop/shopfront/product-edit/product-edit.component';
import { AdminarchivelistComponent } from './FrontOffice/Auth+shop/shopfront/adminarchivelist/adminarchivelist.component';
import { ElderlyOrderInfoComponent } from './FrontOffice/Auth+shop/shopfront/elderly-order-info/elderly-order-info.component';
import { AmbulanceDriverComponent } from './FrontOffice/Auth+shop/ambulance-driver/ambulance-driver.component';
import { NurseComponent } from './FrontOffice/Auth+shop/nurse/nurse.component';
import { UpdateUserComponent } from './FrontOffice/Auth+shop/update-user/update-user.component';
import { SigninComponent } from './FrontOffice/Auth+shop/signin/signin.component';
import { SignComponent } from './FrontOffice/Auth+shop/sign/sign.component';
import { HomeFrontComponent } from './FrontOffice/Auth+shop/home-front/home-front.component';
import { DoctorComponent } from './FrontOffice/Auth+shop/doctor/doctor.component';
import { ElderlyComponent } from './FrontOffice/Auth+shop/elderly/elderly.component';
import { AmbulanceOwnerComponent } from './FrontOffice/Auth+shop/ambulance-owner/ambulance-owner.component';
import { AlltemplatesfontComponent } from './FrontOffice/Auth+shop/shopfront/templatehazem/alltemplatesfont/alltemplatesfontshop.component';
import { AddAmbulanceComponent } from './FrontOffice/Ambulance/add-ambulance/add-ambulance.component';
import { AfficheAmbulanceComponent } from './FrontOffice/Ambulance/affiche-ambulance/affiche-ambulance.component';
import { AllTemplateNadhirComponent } from './FrontOffice/Ambulance/all-template-nadhir/all-template-nadhir.component';
import { GetAllAmbulanceComponent } from './FrontOffice/Ambulance/get-all-ambulance/get-all-ambulance.component';
import { UpdateAmbulanceComponent } from './FrontOffice/Ambulance/update-ambulance/update-ambulance.component';
import { ChatComponent } from './FrontOffice/chat/chat.component';
import { ListRelativeComponent } from './BackOffice/list-relative/list-relative.component';
import { ElderlyprofileComponent } from './FrontOffice/Auth+shop/shopfront/elderlyprofile/elderlyprofile.component';
import { ProfildoctorComponent } from './FrontOffice/pages2/profildoctor/profildoctor.component';
import { ProfilenurseComponent } from './FrontOffice/Auth+shop/profilenurse/profilenurse.component';
import { ProfiledriverComponent } from './FrontOffice/Auth+shop/profiledriver/profiledriver.component';
import { AllTemplateRelativeComponent } from './FrontOffice/Ambulance/all-template-relative/all-template-relative.component';
import { ProfiledownerComponent } from './FrontOffice/Auth+shop/profiledowner/profiledowner.component';
import { ProfilerelativeComponent } from './FrontOffice/Auth+shop/profilerelative/profilerelative.component';
import { AfficheOwnerComponent } from './FrontOffice/Ambulance/affiche-owner/affiche-owner.component';
import {  TodosComponent } from './FrontOffice/pages2/todos/todos.component';
import { TodoRelativeComponent } from './FrontOffice/pages2/todo-relative/todo-relative.component';
import { JitsiComponent } from './FrontOffice/pages2/jitsi/jitsi.component';
import { BoardComponent } from './FrontOffice/pages2/board/board.component';
import { GameComponent } from './FrontOffice/pages2/game/game.component';
import { ElderlyNadhirComponent } from './FrontOffice/Ambulance/elderly-nadhir/elderly-nadhir.component';
import { DriverNadhirComponent } from './FrontOffice/Ambulance/driver-nadhir/driver-nadhir.component';
import { AllTemplateDriveComponent } from './FrontOffice/Ambulance/all-template-drive/all-template-drive.component';
import { AfficheDriverComponent } from './FrontOffice/Ambulance/affiche-driver/affiche-driver.component';
import { RelativeComponent } from './FrontOffice/Tracking/relative/relative.component';
import { TrackingComponent } from './FrontOffice/Tracking/tracking/tracking.component';
 
const routes: Routes = [


  { path: 'admin/get/edit/:id', component: UpdateAmbulanceComponent },

         { path: 'game', component: GameComponent },

  

  {
    path:"" , 
    component:AllTemplateFrontComponent,
    children:[
      {
        path:"",
        component:HomeFrontComponent,
        
      },
      {
        path:"aff",
        component:AfficheAmbulanceComponent,
        
      } ,  { path: 'todolist/:elderlyId', component: BoardComponent } 
      
      
    ]
  },


  
  {
    path:"signUp" , 
    component:SignComponent
  },
  
    {
      path:"signIn" , 
      component:SigninComponent
    },
    { path: 'update/:id',
   component: UpdateUserComponent
   },
{
  path: 'doctor/:doctorId',
  component:DoctorComponent
},
{
  path: 'elderly/:id',
  component:ElderlyComponent
},
{
  path: 'nurse/:id',
  component:NurseComponent
},
{
  path: 'ambulanceDriver/:id',
  component:AmbulanceDriverComponent
},
{
  path: 'ambulanceOwner/:id',
  component:AmbulanceOwnerComponent
},


{
  path: "chat",
  component: ChatComponent,
},
 
{
  path:"admin" , 
  component:AllTemplateBackComponent
},


{
  path:"listUser" , 
  component:ListUserComponent
},


{
  path:"archive" , 
  component:ListArchiveComponent
},

{
  path:"listDoctor" , 
  component:ListDoctorComponent
},
{
  path:"listElderly",
  component:ListElderlyComponent
},
{
  path:'listAmbulanceDriver',
  component:ListAmbulanceDriverComponent,
 },
 {
  path:'listAmbulanceOwner',
  component:ListAmbulanceOwnerComponent,
 },
 {
  path:'listNurse',
  component:ListNurseComponent,
 },
 {
  path:'listRelative',
  component:ListRelativeComponent,
 },
   {
    path:'statistics',
    component:RoleStatisticsComponent,
   },
   

{
  path: '',
  component: AlltemplatesfontComponent ,
  children: [
    {
      path: '',
      component: HomeshopComponent
    },
    { path: 'dash/:elderlyId', component: ElderlyDashboardComponent },
    { path: 'todo/:elderlyId', component: TodosComponent },
    { path: 'game/:elderlyId', component: GameComponent },


  { path: 'doctor-profile/:id/:elderlyId', component: DoctorProfileComponent },
  //teb3a l elderly 
  { path: 'doctor-calendar/:id/:elderlyId', component: CalendarComponent },


    { path: 'product-details/:id', component: ProductdetailsComponent }, // Route for editing a specific product
    {
      path: 'products/:elderlyId',
      component: ProductlistclientComponent
    },

      {
        path: 'elderly/nadhir/:elderlyId',
        component: ElderlyNadhirComponent
      },
    {
      path: 'profileeldery',
      component: ElderlyprofileComponent
    },
    {
      path: 'doctor-profile',
      component: ProfildoctorComponent
    },
    {
      path: 'profilerelative',
      component:ProfilerelativeComponent
    },
    {
      path: 'nurse/:id',
      component:NurseComponent
    },
    {
      path: 'profiledriver',
      component:ProfiledriverComponent
    },
    {
      path: 'profilenurse',
      component:ProfilenurseComponent
    },
    {
      path: 'profileowner',
      component:ProfiledownerComponent
    },
    {
      path: 'elderly/:elderlyId/cart',
      component: ElderlyCartComponent}, { path: 'dash/:elderlyId', component: ElderlyDashboardComponent },
    
    
     //tracking Mariem 
     { path: 'tracking/:id', component: TrackingComponent }, // Route to access the Tracking component with a parameter for elderly ID

    ]
  },


  
    {
      path: 'admin',
      component: AllTemplateBackComponent,
      children: [
       
        {
          path: 'add-product',
          component: AddProductComponent
        },
        {
          path: 'productlist',
          component: ProductlistComponent
        },
        { path: 'products/:id/edit', component: ProductEditComponent },
        { path: 'archive', component: AdminarchivelistComponent },
        { path: 'historique', component: ElderlyOrderInfoComponent },
        {
          path: 'get',
          component: GetAllAmbulanceComponent
        }
  ,{
    path: 'get',
    component: GetAllAmbulanceComponent
  }
     

  ]
},
{
  path: 'nadhir',
  component: AllTemplateNadhirComponent,
  children: [
   
    {
      path: 'add',
      component: AddAmbulanceComponent
    }
    
    
  
,
  
    {
      path: 'own',
      component: AfficheOwnerComponent
    }
 

]
},


{path: 'relative',
component: AllTemplateRelativeComponent,
children: [
 
 
  {
    path: 'aff',
    component: AfficheAmbulanceComponent
  }, 
  
  {
    path: 'aff/:relativeId', // Utilisation des paramètres de route pour l'ID du parent relatif
    component: AfficheAmbulanceComponent
  }
,       { path: 'todoRelative/:relativeId', component: TodoRelativeComponent },


  //tracking Mariem 
  { path: 'tracking/:id', component: RelativeComponent }, 




]

}











































,
//oumayma
  {
    path: "",
    redirectTo: "/home",
    pathMatch: "full"
  },
  {
    path: "",
    component: AllTemplateFrontOumaymaComponent,
    children: [
      {
        path: "home",
        component: HomeFrontOumaymaComponent
      },
      {
        path: 'homeDoctor',
        component: HomeFrontOumaymaComponent
      },
      
      {
    path: "calendar",
    component: CalendarComponent
      }, 
      {
        path: 'elderly/nadhir/:elderlyId',
        component: ElderlyNadhirComponent
      },
  {//http://localhost:4200/calendarDoctor/1?calendarId=1
    path: 'calendarDoctor/:id',
    component: CalendarDoctorComponent
  }
  ,
  {
    path: 'jitsi/:id',
    component: JitsiComponent
  },
  { path: 'doctor-dashboard/:id',
   component: DoctorDashboardComponent }
   ,{
    path: "todo",
    component: TodosComponent
      }
    ]

  },

  {
    path: 'driv/:ambulanceId',
    component: AfficheDriverComponent
  },
  {
    path: 'd',
    component: AllTemplateDriveComponent,
    children: [
      {
        path: 'DriverNadhir/:id', // Utilisation des paramètres de route pour l'ID du parent relatif
        component: DriverNadhirComponent
      }
    ]
  }

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}