import { Component } from '@angular/core';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-list-archive',
  templateUrl: './list-archive.component.html',
  styleUrls: ['./list-archive.component.css']
})
export class ListArchiveComponent {
  archivedUsers: any[] = [];

  constructor(private archiveService: UserService) { }

  ngOnInit(): void {
    this.loadArchivedUsers();
  }

  loadArchivedUsers() {
    this.archiveService.getArchivedUsers().subscribe(
      (data: any) => {
        this.archivedUsers = data;
      },
      error => {
        console.error('Error loading archived users:', error);
      }
    );
  }
}