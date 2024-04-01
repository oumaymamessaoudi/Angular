import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'audioUrl'
})
export class AudioUrlPipe implements PipeTransform {
  transform(audioContent: ArrayBuffer): string {
    const audioBlob = new Blob([audioContent], { type: 'audio/webm' });
    return URL.createObjectURL(audioBlob);
  }
}
