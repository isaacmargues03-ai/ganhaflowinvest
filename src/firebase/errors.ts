export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
  public context: SecurityRuleContext;

  constructor(context: SecurityRuleContext) {
    const message = `Firestore permission denied for ${context.operation} on ${context.path}`;
    super(message);
    this.name = 'FirestorePermissionError';
    this.context = context;
  }

  toContextObject() {
    return {
      message: this.message,
      path: this.context.path,
      operation: this.context.operation,
      requestData: this.context.requestResourceData,
    };
  }
}
