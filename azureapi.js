"use strict";

var AzureAPI = function () {
    var resources = [
        "virtualMachines",
        "scaleSets",
        "storageAccounts",
        "networkSecurityGroups",
        "applicationGateways",
        "HDInsights",
        "loadBalancers",
        "batches",
        "virtualnetworks",
        "appServices",
        "redis",
        "resourceGroups",
        "expressroutes",
        "servicefabrics",
        "cosmosdbs"
    ]
    
    var Azure = require('azure');
    var MsRest = require('ms-rest-azure');
    var BatchManagementClient = require('azure-arm-batch');
    var HDInsightClient = require('azure-arm-hdinsight');
    var subscriptionID;
    var credentials;
    var watchHandle;

    function validate(appId, password, tenantId, subscriptionId) {
        var result = {
            passed: false,
            message: ''
        }
        
        if (!appId) {
            result.message = 'appId cannot be empty';
        }
        else if (!password) {
            result.message = 'password cannot be empty';
        }
        else if (!tenantId) {
            result.message = 'tenantId cannot be empty';
        }
        else if (!subscriptionId) {
            result.message = 'subscriptionId cannot be empty';
        }
        else {
            result.passed = true;
        }

        return result;
    }

    function authenticate(appId, password, tenantId, subscriptionId, onAuthDone) {
        var validation = validate(appId, password, tenantId, subscriptionId);
        if (!validation.passed) {
            onAuthDone({ status: 'error', message: validate.message });
            return;
        }

        MsRest.loginWithServicePrincipalSecret(
            appId,
            password,
            tenantId,
            (err, creds) => {
                if (err) throw err

                subscriptionID = subscriptionId;
                credentials = creds;
                onAuthDone({ status: 'ok' });
            }
        );
    }

    function getVMs(callback) {
        let comp = new Azure.createComputeManagementClient(credentials, subscriptionID);
        comp.virtualMachines.listAll((err, vms) => {
            callback(vms);
        });
    }

    function getVMSS(callback) {
        let comp = new Azure.createComputeManagementClient(credentials, subscriptionID);
        comp.virtualMachineScaleSets.listAll((err, ss) => {
            callback(ss);
        });
    }

    function getStorageAccounts(callback) {
        let storageClient = new Azure.createStorageManagementClient(credentials, subscriptionID);
        storageClient.storageAccounts.list((err, sa) => {
            callback(sa);
        });
    }

    function getHDInsights(callback) {
        credentials.subscriptionId = subscriptionID;

        let hdInsightClient = HDInsightClient.createHDInsightManagementClient(credentials);
        hdInsightClient.clusters.list((err, response) => {
            callback(response.clusters);
        });
    }

    function getLoadBalancers(callback) {
        let networkClient = new Azure.createNetworkManagementClient(credentials, subscriptionID);
        networkClient.loadBalancers.listAll((err, lbs) => {
            callback(lbs);
        });
    }

    function getBatch(callback) {
        var client = new BatchManagementClient(credentials, subscriptionID);
        client.account.list((err, batches) => {
            callback(batches);
        });
    }

    function getNSGs(callback) {
        let networkClient = new Azure.createNetworkManagementClient(credentials, subscriptionID);
        networkClient.networkSecurityGroups.listAll((err, nsgs) => {
            callback(nsgs);
        });
    }

    function getAppServices(callback) {
        let appServicesClient = new Azure.createWebsiteManagementClient(credentials, subscriptionID);
        appServicesClient.global.getAllSites((err, webapps) => {
            callback(webapps);
        });
    }

    function getApplicationGateways(callback) {
        let networkClient = new Azure.createNetworkManagementClient(credentials, subscriptionID);
        networkClient.applicationGateways.listAll((err, appGWs) => {
            callback(appGWs);
        });
    }

    function getExpressRoutes(callback) {
        let networkClient = new Azure.createNetworkManagementClient(credentials, subscriptionID);
        networkClient.expressRouteCircuits.listAll((err, circuits) => {
            callback(circuits);
        });
    }

    function getVirtualNetworks(callback) {
        let networkClient = new Azure.createNetworkManagementClient(credentials, subscriptionID);
        networkClient.virtualNetworks.listAll((err, vnets) => {
            callback(vnets);
        });
    }

    function getRedisCaches(callback) {
        let redisClient = new Azure.createRedisCacheManagementClient(credentials, subscriptionID);
        redisClient.redis.list((err, redis) => {
            callback(redis);
        });
    }

    function getServiceFabric(callback) {
        let sfClient = new Azure.createServiceFabricManagementClient(credentials, subscriptionID);
        sfClient.clusters.list((err, sf) => {
            callback(sf);
        });
    }

    function getCosmosDbs(callback) {
        let cosmosClient = new Azure.createDocumentdbManagementClient(credentials, subscriptionID);
        cosmosClient.databaseAccounts.list((err, cosmos) => {
            callback(cosmos);
        });
    }

    function getResourceGroups(callback) {
        let rgClient = new Azure.createResourceManagementClient(credentials, subscriptionID);
        rgClient.resourceGroups.list((err, resourceGroups) => {
            callback(resourceGroups);
        });
    }
    
    function queryResources(resourceName, callback) {
        switch (resourceName.toLowerCase()) {
            case "virtualmachines": {
                getVMs(callback);
                break;
            }
            case "scalesets": {
                getVMSS(callback);
                break;
            }
            case "storageaccounts": {
                getStorageAccounts(callback);
                break;
            }
            case "networksecuritygroups": {
                getNSGs(callback);
                break;
            }
            case "applicationgateways": {
                getApplicationGateways(callback);
                break;
            }
            case "expressroutes": {
                getExpressRoutes(callback);
                break;
            }
            case "hdinsights": {
                getHDInsights(callback);
                break;
            }
            case "loadbalancers": {
                getLoadBalancers(callback);
                break;
            }
            case "batches": {
                getBatch(callback);
                break;
            }
            case "virtualnetworks": {
                getVirtualNetworks(callback);
                break;
            }
            case "appservices": {
                getAppServices(callback);
                break;
            }
            case "redis": {
                getRedisCaches(callback);
                break;
            }
            case "resourcegroups": {
                getResourceGroups(callback);
                break;
            }
            case "servicefabrics": {
                getServiceFabric(callback);
                break;
            }
            case "cosmosdbs": {
                getCosmosDbs(callback);
                break;
            }
            default:
                callback();
                break;
        }
    }

    function getResourcesNames() {
        return resources;
    }

    return {
        authenticate: authenticate,
        getResourcesNames: getResourcesNames,
        queryResources: queryResources
    }
}();

module.exports = AzureAPI;