# AzureQL
AzureQL is node.js package that allows you to query Microsoft Azure resources with SQL syntax

## Install

```shell
npm install azureql
```
## Usage

AzureQL needs the following inputs:

1) appId - ApplicationId of an Azure Active Directory application with permissions to access Azure API
2) password - The password of the Azure AD app
3) subscriptionId - the ID of the subscription
4) tenantId - Get it from the Azure Portal, navigate to Active Directory, Manage / Properties, and copy the Directory ID

Getting started:

```shell
var AzureQL =  require ('azureql');

AzureQL.init(process.env.appId, process.env.password, process.env.tenantId, process.env.subscriptionId, () => {
    AzureQL.performQuery('select * from VirtualMachines where name="myVM"', (response) => {
        log.console(response.results);
    });
});
```
## Queryable resources

As of now, supported resources (tables) to query are: VirtualMachines, ScaleSets, StorageAccounts, NetworkSecurityGroups, ApplicationGateways, HDInsights, LoadBalancers, Batches, VirtualNetworks, AppServices, Redis, ResourceGroups, ExpressRoutes

More will be added soon.

## API structure

All tables, columns and return objects are valid representations of the Azure API object models which you can find [here].

[here]: https://docs.microsoft.com/en-us/rest/api/
