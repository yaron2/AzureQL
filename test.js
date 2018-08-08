var AzureQL =  require ('./app.js');

AzureQL.init(process.env.appId, process.env.password, process.env.tenantId, process.env.subscriptionId, () => {
    AzureQL.performQuery('select * from cosmosdbs', (response) => {
        console.log(response.results);
    });
});