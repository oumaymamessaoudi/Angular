import { Component, ChangeDetectorRef, OnInit, ElementRef } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, EventInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { CalendarService } from '../../services2/calendar.service';
import { Appointment } from '../../entities/appointment.model';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup ,Validators} from '@angular/forms';
declare var createGoogleEvent: any;

@Component({
  selector: 'app-calendar-doctor',
  templateUrl: './calendar-doctor.component.html',
  styleUrls: ['./calendar-doctor.component.css']
})
export class CalendarDoctorComponent implements OnInit {
  
  appointmentForm2!: FormGroup;
  showApprovalForm = false;
  appointmentId: number; // Add this line
  isInputsVisible = false;
  selectedAppointmentId: number | null = null;

  completedEvents: EventApi[] = [];
  approvedEvents: EventApi[] = [];
  doctorUsername: string; // Variable to store the doctor's username
  elderlyName:string;
  
  
  doctorId: number; // Add this line
  calendarId: number; // Add this line

  calendarVisible = true;
  currentEvents: EventApi[] = [];
  ///////////////////////////////////////////////////////
  pendingEvents: EventApi[] = [];
///////////////////////////////////////////////////////////
  calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    weekends: true,
    editable: false, // Set to false to disable drag-and-drop
    selectable: false,
    selectMirror: true,
    dayMaxEvents: true,
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    
  };

  constructor(
    private calendarService: CalendarService,
    private changeDetector: ChangeDetectorRef,
    private route: ActivatedRoute,
    private fb: FormBuilder,private elementRef: ElementRef
  ) {}

ngOnInit() {
  
  this.isInputsVisible = false; // Set to true to make inputs visible

  this.route.params.subscribe(params => {
    this.doctorId = +params['id'];
    this.calendarId = +this.route.snapshot.queryParams['calendarId'];

    this.calendarService.getDoctorEmail(this.doctorId).subscribe(
      (email: string) => {
        // Initialize form with fetched email
        this.appointmentForm2 = this.fb.group({
          appointmentName: ['', Validators.required], // Add appointmentName control

          appointmentTime: ['', Validators.required],
          email: [email, [Validators.required, Validators.email]],
          appointmentId: [null]
        });
        this.calendarService.getDoctorName(this.doctorId).subscribe(
          (username: string) => {
            this.doctorUsername = username;
          },
          (error) => {
            console.error('Error fetching doctor username:', error);
          }





        );






        
        this.loadAppointments();
        this.loadPendingAppointments();
        this.loadApprovedAppointments(); // Add this line
       this.loadCompletedAppointments(); // Add this line
      },
      (error) => {
        console.error('Error fetching doctor email:', error);
      }
    );
  });
}












loadAppointments() {
    // Check if calendarId is a valid number before making the request
    if (!isNaN(this.calendarId) && this.calendarId > 0) {
      this.calendarService.getAppointmentsByCalendarId(this.calendarId).subscribe(
        (appointments: Appointment[]) => {
          this.updateCalendarEvents(appointments);
        },
        (error) => {
          console.error('Error fetching appointments:', error);
        }
      );
    } else {
      console.error('Invalid calendarId:', this.calendarId);
    }
  }
  updateCalendarEvents(appointments: Appointment[]) {
    const approvedAppointments = appointments.filter(appointment => appointment.appStatus === 'APPROVED');
    const events: EventInput[] = approvedAppointments.map((appointment) => ({
      id: appointment.idAppointment.toString(),
      title: appointment.patientName,
      start: new Date(appointment.appFrom),
      end: new Date(appointment.appTo),
    }));

    // Set the events to the FullCalendar
    this.currentEvents = events as EventApi[];
    this.calendarOptions.events = events;
    this.changeDetector.detectChanges();
  }

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleEventClick(clickInfo: EventClickArg) {
    // Handle event click if needed
    console.log('Event clicked:', clickInfo);
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }
  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }
  
  loadPendingAppointments() {
    if (!isNaN(this.calendarId) && this.calendarId > 0) {
      this.calendarService.getPendingAppointmentsByCalendarId(this.calendarId).subscribe(
        (pendingAppointments: Appointment[]) => {
          this.updatePendingAppointments(pendingAppointments);
        },
        (error) => {
          console.error('Error fetching pending appointments:', error);
        }
      );
    } else {
      console.error('Invalid calendarId:', this.calendarId);
    }
  }

  updatePendingAppointments(pendingAppointments: Appointment[]) {
    console.log('Pending Appointments:', pendingAppointments);


    const events: EventInput[] = pendingAppointments.map((appointment) => ({
      id: appointment.idAppointment.toString(),
      title: appointment.patientName,
      start: new Date(appointment.appFrom),
      end: new Date(appointment.appTo),
    }));

    // Set the events to the FullCalendar
    this.pendingEvents = events as EventApi[];
    this.changeDetector.detectChanges();
  }
  

  cancelApproval() {
    this.selectedAppointmentId = null;
    this.showApprovalForm = false;
  }

  approveAppointment(appointmentId: number) {
    this.appointmentId = appointmentId; // Set the appointment ID
    this.selectedAppointmentId = appointmentId;

    this.calendarService.getAppointmentById(appointmentId).subscribe(
      (appointment: Appointment) => {
        console.log(appointment.idAppointment); // Log the fetched appFrom value

        console.log('Fetched appFrom:', appointment.appFrom); // Log the fetched appFrom value

        // Set the appointment time value in the form
        this.appointmentForm2.patchValue({
          appointmentTime: appointment.appFrom,
        });





        console.log("app idddddddd",this.appointmentId);


          // Fetch the elderly name using the appointment's details
      this.calendarService.getElderlyNameByAppointmentId(appointmentId).subscribe(
        (elderlyName: string) => {  
          this.elderlyName = elderlyName;
  
        console.log("aaaaaaaaaaaaaaaaaaa",elderlyName);
          // Set default value for appointmentName field
          this.appointmentForm2.patchValue({
            appointmentName: elderlyName
            
          });
          
        },
        (error) => {
          console.error('Error fetching elderly name:', error);
        }
      );





  
        this.showApprovalForm = true; // Show the approval form
  
        // Update the list of pending appointments after approval
        this.loadPendingAppointments();
      },
      (error) => {
        console.error('Error approving appointment:', error);
      }
    );
  }

  

  formatAppointmentTime(): string {
    const appointmentTime = this.appointmentForm2.value.appointmentTime;
    if (!appointmentTime) {
      return '';
    }
    
    // Format the appointment time as "jj/mm/aaaa --:-- --"
    const date = new Date(appointmentTime);
    const formattedDate = date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const formattedTime = date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    
    return `${formattedDate} ${formattedTime}`;
  }
  confirmApproval(appointmentId: number) {

    this.calendarService.approveAppointment(appointmentId).subscribe(
      (appointment: Appointment) => {
        console.log('Fetched appFrom:', appointment.appFrom); // Log the fetched appFrom value

         
        // Update the list of pending appointments after approval
        this.loadPendingAppointments();
      },
      (error) => {
        console.error('Error approving appointment:', error);
      }
    );
  }
 
  scheduleMeeting() {
    console.log("id", this.appointmentId);
    this.confirmApproval(this.appointmentId);
    const appointmentTimeString = this.appointmentForm2.value.appointmentTime;
    const appointmentTime = new Date(appointmentTimeString);
 
    if (isNaN(appointmentTime.getTime())) {
      console.error('Invalid date format:', appointmentTimeString);
      return;
    }
 
    // Convert the date to the desired format with a custom offset (e.g., -07:00)
    const startTimeUTC = this.convertToUTC(appointmentTime);
    const endTimeUTC = this.getEndTime(appointmentTime);

    const eventDetails = {
      name: this.elderlyName,
      email: this.appointmentForm2.value.email,
      startTime: startTimeUTC,
      endTime: endTimeUTC,
    };
 
    console.info(eventDetails);
    createGoogleEvent(eventDetails);
  }
 
  convertToUTC(date: Date): string {
    const utcString = date.toISOString();
    // Convert the ISO string to UTC format (e.g., "2024-03-10T13:00:00Z")
    return utcString.substring(0, 19) + 'Z';
}
getEndTime(appointmentTime: Date): string {
  // Add two hours to the date and convert it to UTC
  const endTime = new Date(appointmentTime.getTime() + 2 * 60 * 60 * 1000); // Adding 2 hours in milliseconds
  return this.convertToUTC(endTime);
}



  generateICSFile() {
    const datetimeValue = this.appointmentForm2.value.appointmentTime;
    const date = new Date(datetimeValue);
    const endTime = new Date(date);
    endTime.setHours(endTime.getHours() + 1);
    // Format dates to be in the proper format for the .ics file
    const formattedStartDate = date
      .toISOString()
      .replace(/-/g, '')
      .replace(/:/g, '')
      .slice(0, -5);
    const formattedEndDate = endTime
      .toISOString()
      .replace(/-/g, '')
      .replace(/:/g, '')
      .slice(0, -5);
    // Event details
    const eventName = 'Sample Event';
    const eventDescription = 'This is a sample event';
    const location = 'Sample Location';
    // Create the .ics content
    const icsContent = `BEGIN:VCALENDAR
  VERSION:2.0
  BEGIN:VEVENT
  DTSTAMP:${formattedStartDate}Z
  DTSTART:${formattedStartDate}Z
  DTEND:${formattedEndDate}Z
  SUMMARY:${eventName}
  DESCRIPTION:${eventDescription}
  LOCATION:${location}
  END:VEVENT
  END:VCALENDAR`;
    // Create a Blob containing the .ics content
    const blob = new Blob([icsContent], {
      type: 'text/calendar;charset=utf-8',
    });
    // Create a download link for the Blob
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'event.ics';
    // Trigger the download
    downloadLink.click();
  }

  rejectAppointment(appointmentId: number) {
    const isConfirmed = window.confirm('Are you sure you want to reject this appointment?');
 
    if (isConfirmed) {
      this.calendarService.rejectAppointment(appointmentId).subscribe(
        () => {
          // Update the list of pending appointments after rejection
          this.loadPendingAppointments();
          this.loadApprovedAppointments();
        },
        (error) => {
          console.error('Error rejecting appointment:', error);
        }
      );
    }
  }


  loadApprovedAppointments() {
    if (!isNaN(this.calendarId) && this.calendarId > 0) {
      this.calendarService.getApprovedAppointmentsByCalendarId(this.calendarId).subscribe(
        (approvedAppointments: Appointment[]) => {
          this.updateApprovedAppointments(approvedAppointments);
        },
        (error) => {
          console.error('Error fetching approved appointments:', error);
        }
      );
    } else {
      console.error('Invalid calendarId:', this.calendarId);
    }
  }
 
  updateApprovedAppointments(approvedAppointments: Appointment[]) {
    console.log('Approved Appointments:', approvedAppointments);




    const events: EventInput[] = approvedAppointments.map((appointment) => ({
      id: appointment.idAppointment.toString(),
      title: appointment.patientName,
      start: new Date(appointment.appFrom),
      end: new Date(appointment.appTo),
    }));
    // Set the events to the FullCalendar
    this.approvedEvents = events as EventApi[];
    this.changeDetector.detectChanges();
  }

  completeAppointment(appointmentId: number) {
    const isConfirmed = window.confirm('Are you sure you want to Mark this appointment As Done?');
 
    if (isConfirmed) {
      this.calendarService.completeAppointment(appointmentId).subscribe(
        () => {
          // Update the list of pending appointments after completion
          this.loadPendingAppointments();
          this.loadApprovedAppointments();
              window.location.reload();


        },
        (error) => {
          console.error('Error completing appointment:', error);
        }
      );
    }
  }
 
 
 
  updateCompletedAppointments(completedAppointments: Appointment[]) {
    console.log('Completed Appointments:', completedAppointments);




    const events: EventInput[] = completedAppointments.map((appointment) => ({
      id: appointment.idAppointment.toString(),
      title: appointment.patientName,
      start: new Date(appointment.appFrom),
      end: new Date(appointment.appTo),
    }));
    this.completedEvents = events as EventApi[];
    this.changeDetector.detectChanges();
  }
  loadCompletedAppointments() {
    if (!isNaN(this.calendarId) && this.calendarId > 0) {
      this.calendarService.getCompletedAppointmentsByCalendarId(this.calendarId).subscribe(
        (completedAppointments: Appointment[]) => {
          this.updateCompletedAppointments(completedAppointments);
        },
        (error) => {
          console.error('Error fetching completed appointments:', error);
        }
      );
    } else {
      console.error('Invalid calendarId:', this.calendarId);
    }
  }
 
}