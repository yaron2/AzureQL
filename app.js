"use strict";

var AzureQL = function () {
    var AzureAPI = require('./azureapi');
    var alasql = require('alasql');
    
    function init(appId, password, tenantId, subscriptionId, readyCallback) {
        AzureAPI.authenticate(appId, password, tenantId, subscriptionId, (response) => {
            if (response.status == 'error')
                throw new Error("Authentication with Azure failed");

            if (readyCallback)
                readyCallback();
        });
    }

    function getTableToQuery(query, resources) {
        for (var r in resources) {
            var resource = resources[r];
            if (query.toLowerCase().includes(resource.toLowerCase())) {
                return resource;
            }
        }
    }
    
    function getFixedQuery(query, table) {
        var indexOfQueryTable = query.toLowerCase().indexOf(table);
        query = query.replace(query.substr(indexOfQueryTable, table.length), table);

        return query;
    }

    function performQuery(query, callback) {
        var resources = AzureAPI.getResourcesNames();
        var table = getTableToQuery(query, resources);
        if (table) {
            table = table.toLowerCase();

            if (!alasql.tables[table])
                alasql("CREATE TABLE " + table);

            AzureAPI.queryResources(table, (data) => {
                alasql.tables[table].data = data;
                
                try {
                    query = getFixedQuery(query, table);

                    var res = alasql(query);
                    callback({ status: 'ok', results: res });
                }
                catch (e) {
                    callback({ status: 'error', message: 'failed to query Azure resources' });
                }
            });
        }
        else {
            callback({ status: 'error', message: 'target table not supported' });
        }
    }

    return {
        init: init,
        performQuery: performQuery
    }
}();

module.exports = AzureQL;