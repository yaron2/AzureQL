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

Getting started:

```shell
var AzureQL =  require ('azureql');

AzureQL.init(process.env.appId, process.env.password, process.env.tenantId, process.env.subscriptionId, () => {
    AzureQL.performQuery('select * from virtualmachines where name="myVM"';, (response) => {
        log.console(response.results);
    });
});
```
## API structure

All tables, columns and return objects are valid representations of the Azure API object models which you can find [here].

[here]: https://docs.microsoft.com/en-us/rest/api/
