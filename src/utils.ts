export default (() => {

    function getLogger(log: Boolean) {
        return (message: any) => {
            if (log) console.log(message);
        }
    }

    return {
        getLogger
    }

})();



