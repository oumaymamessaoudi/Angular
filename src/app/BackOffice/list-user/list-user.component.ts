import { Component } from '@angular/core';
import { UserService } from '../Services/user.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from 'src/app/FrontOffice/Auth+shop/Model/user';
import { RoleStatisticsService } from '../Services/role-statistics.service';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent {
  users: any[] = [];
  userForm: FormGroup; // Déclaration du formulaire
  searchText: string = ''; // Ajout de la propriété searchText
  roleStatistics: any;


  constructor(
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private roleStatisticsService: RoleStatisticsService
  ) {
    // Initialisation du formulaire dans le constructeur
    this.userForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      phoneNumber: [''],
      dateOfBirth: [''],
      role: [''],
      

      
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.getRoleStatistics();

  }

 

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(
      (data: any[]) => {
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe(
      () => {
        // Assuming you want to refresh the user list after deleting a user
        this.userService.getAllUsers().subscribe(
          (users: User[]) => {
            this.users = users;
          },
          (error) => {
            console.error('Error fetching users:', error);
          }
        );
      },
      (error) => {
        console.error('Error deleting user:', error);
      }
    );
  }
  ActivateUser(id: number): void {
    this.userService.ActivateUser(id).subscribe(
      () => {
        // Assuming you want to refresh the user list after deleting a user
        this.userService.getAllUsers().subscribe(
          (users: User[]) => {
            this.users = users;
          },
          (error) => {
            console.error('Error fetching users:', error);
          }
        );
      },
      (error) => {
        console.error('Error deleting user:', error);
      }
    );
  }
  
  viewArchive() {
    this.router.navigate(['/archive']); 
  }


  searchUsersByEmail(email: string): void {
    this.userService.searchUsersByEmail(email).subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error searching users by email:', error);
      }
    );
    }
    searchUsersByRole(role: string): void {
      this.userService.searchUsersByRole(role).subscribe(
        (data) => {
          this.users = data;
        },
        (error) => {
          console.error('Error searching users by role:', error);
        }
      );
    }
    
  
    getRoleStatistics(): void {
      this.roleStatisticsService.getRoleStatistics()
        .subscribe(
          data => {
            this.roleStatistics = data;
            console.log(this.roleStatistics); // Affichage des données récupérées dans la console
          },
          error => {
            console.log(error);
          }
        );
    }
}