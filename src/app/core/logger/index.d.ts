declare interface ILogger extends angular.ILogService {
	getInstance(instanceName : string) : ILogger
}