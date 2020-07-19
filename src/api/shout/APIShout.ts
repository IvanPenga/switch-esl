type API = (command: string) => Promise<string>;

export default (api: API) => {

    function broadcast(uuid: string, url: string) {
        return api(`uuid_broadcast ${uuid} ${convertToShout(url)}`);
    }

    function convertToShout(url: string){
        const data = url.split('://');
        return 'shout://' + data[data.length - 1]; 
    }

    return {
        broadcast
    }

};