export type EvaluationContext = {
  /**
   * A string uniquely identifying the subject (end-user, or client service) of a flag evaluation.
   * Providers may require this field for fractional flag evaluation, rules, or overrides targeting specific users. Such providers may behave unpredictably if a targeting key is not specified at flag resolution.
   */
  targetingKey?: string;
} & Record<string, string | number | boolean | Date>;

export type FlagValue = boolean | string | number | object;

export interface FlagEvaluationOptions {
  hooks?: Hook[];
}

export interface Features {
  /**
   * Get a boolean flag value.
   */
  getBooleanValue(
    flagKey: string,
    defaultValue: boolean,
    context?: EvaluationContext,
    options?: FlagEvaluationOptions
  ): Promise<boolean>;

  /**
   * Get a boolean flag with additional details.
   */
  getBooleanDetails(
    flagKey: string,
    defaultValue: boolean,
    context?: EvaluationContext,
    options?: FlagEvaluationOptions
  ): Promise<EvaluationDetails<boolean>>;

  /**
   * Get a string flag value.
   */
  getStringValue(
    flagKey: string,
    defaultValue: string,
    context?: EvaluationContext,
    options?: FlagEvaluationOptions
  ): Promise<string>;

  /**
   * Get a string flag with additional details.
   */
  getStringDetails(
    flagKey: string,
    defaultValue: string,
    context?: EvaluationContext,
    options?: FlagEvaluationOptions
  ): Promise<EvaluationDetails<string>>;

  /**
   * Get a number flag value.
   */
  getNumberValue(
    flagKey: string,
    defaultValue: number,
    context?: EvaluationContext,
    options?: FlagEvaluationOptions
  ): Promise<number>;

  /**
   * Get a number flag with additional details.
   */
  getNumberDetails(
    flagKey: string,
    defaultValue: number,
    context?: EvaluationContext,
    options?: FlagEvaluationOptions
  ): Promise<EvaluationDetails<number>>;

  /**
   * Get an object (JSON) flag value.
   */
  getObjectValue<T extends object>(
    flagKey: string,
    defaultValue: T,
    context?: EvaluationContext,
    options?: FlagEvaluationOptions
  ): Promise<T>;

  /**
   * Get an object (JSON) flag with additional details.
   */
  getObjectDetails<T extends object>(
    flagKey: string,
    defaultValue: T,
    context?: EvaluationContext,
    options?: FlagEvaluationOptions
  ): Promise<EvaluationDetails<T>>;
}

/**
 * Function which transforms the EvaluationContext to a type useful for the provider.
 */
export type ContextTransformer<T = unknown> = (context: EvaluationContext) => T;

interface GenericProvider<T> {
  name: string;

  /**
   * Resolve a boolean flag and it's evaluation details.
   */
  resolveBooleanEvaluation(
    flagKey: string,
    defaultValue: boolean,
    transformedContext: T,
    options: FlagEvaluationOptions | undefined
  ): Promise<ResolutionDetails<boolean>>;

  /**
   * Resolve a string flag and it's evaluation details.
   */
  resolveStringEvaluation(
    flagKey: string,
    defaultValue: string,
    transformedContext: T,
    options: FlagEvaluationOptions | undefined
  ): Promise<ResolutionDetails<string>>;

  /**
   * Resolve a numeric flag and it's evaluation details.
   */
  resolveNumberEvaluation(
    flagKey: string,
    defaultValue: number,
    transformedContext: T,
    options: FlagEvaluationOptions | undefined
  ): Promise<ResolutionDetails<number>>;

  /**
   * Resolve and parse an object flag and it's evaluation details.
   */
  resolveObjectEvaluation<U extends object>(
    flagKey: string,
    defaultValue: U,
    transformedContext: T,
    options: FlagEvaluationOptions | undefined
  ): Promise<ResolutionDetails<U>>;
}

export type NonTransformingProvider = GenericProvider<EvaluationContext>;

export interface TransformingProvider<T> extends GenericProvider<T> {
  contextTransformer: ContextTransformer<Promise<T> | T> | undefined;
}

/**
 * Interface that providers must implement to resolve flag values for their particular
 * backend or vendor.
 *
 * Implementation for resolving all the required flag types must be defined.
 *
 * Additionally, a ContextTransformer function that transforms the OpenFeature context to the requisite user/context/attribute representation (typeof T)
 * may also be implemented. This function will run immediately before the flag value resolver functions, appropriately transforming the context.
 */
export type Provider<T extends EvaluationContext | unknown = EvaluationContext> = T extends EvaluationContext
  ? NonTransformingProvider
  : TransformingProvider<T>;

export interface EvaluationLifeCycle {
  addHooks(...hooks: Hook[]): void;
  get hooks(): Hook[];
}

export interface ProviderOptions<T = unknown> {
  contextTransformer?: ContextTransformer<T>;
}

export type ResolutionDetails<U> = {
  value: U;
  variant?: string;
  reason?: string;
  errorCode?: string;
};

export type EvaluationDetails<T extends FlagValue> = {
  flagKey: string;
} & ResolutionDetails<T>;

export interface Client extends EvaluationLifeCycle, Features {
  readonly name?: string;
  readonly version?: string;
}

export type HookContext = {
  // TODO: implement with hooks
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Hook<T extends FlagValue = FlagValue> {
  // TODO: implement with hooks
}
