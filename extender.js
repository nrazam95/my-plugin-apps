function extender(container, funcName, funcArgs) {
    (function () {
        let proxied = container[funcName];

        container[funcName] = function () {
            if (funcArgs) {
                return proxied.apply(this, funcArgs);
            }
        }
    })();
}

module.exports = extender;