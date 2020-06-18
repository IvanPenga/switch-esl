import AbstractEvent from './AbstractEvent';

class ConferenceMaintenance extends AbstractEvent {

  public 'Conference-Name': string = '';
  public 'Conference-Domain': string = '';
  public 'Conference-Size': string = '';
  public 'Conference-Ghosts': string = '';
  public 'Conference-Profile-Name': string = '';
  public 'Conference-Unique-ID': string = '';
  public 'Action': string = '';
  public 'Caller-ANI': string = '';
  public 'Channel-Call-UUID': string = '';

}

export default ConferenceMaintenance;
