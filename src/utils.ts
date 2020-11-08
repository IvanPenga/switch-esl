export default (() => {

    function getLogger(log: boolean) {
        if (log) return (...data: any[]) => {
            if (log) console.log(...data);
        }
        return () => {};
    }

    return {
        getLogger
    }

})();