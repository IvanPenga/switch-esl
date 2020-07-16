import AbstractEvent from './AbstractEvent';

class BackgroundJob extends AbstractEvent {

    public 'Job-UUID'= '';
    public 'Job-Command'= '';
    public 'Content-Length'= '';
    public _body= '';

}
  
export default BackgroundJob;
  