export default (() => {

    function getLogger(log: boolean) {
        return (message: any) => {
            if (log) console.log(message);
        }
    }

    return {
        getLogger
    }

})();



