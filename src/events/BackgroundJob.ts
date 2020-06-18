import AbstractEvent from './AbstractEvent';

class BackgroundJob extends AbstractEvent {

    public 'Job-UUID': string = '';
    public 'Job-Command': string = '';
    public 'Content-Length': string = '';
    public _body: string = '';

}
  
export default BackgroundJob;
  