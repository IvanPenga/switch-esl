import AbstractEvent from './AbstractEvent';
class ModuleLoad extends AbstractEvent {

    public 'type' = '';
    public 'name' = '';
    public 'description' = '';
    public 'syntax' = '';
    public 'key' = '';
    public 'filename' = '';
}
export default ModuleLoad

