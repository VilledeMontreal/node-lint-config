/**
 * The project types.
 */
export enum ProjectType {
  ANGULAR = 'angular',
  NODE = 'node',
  AUTO = 'auto',
}

/**
 * The actions.
 */
export enum Action {
  CHECK = 'check',
  FIX = 'fix',
}

/**
 * The validation types.
 */
export enum ValidationType {
  PRETTIER = 'prettier',
  ESLINT = 'eslint',
  BOTH = 'both',
}

let allProjectTypes: string[];
let allActions: string[];
let allValidationTypes: string[];

export const getAllProjectTypes = (): string[] => {
  if (!allProjectTypes) {
    allProjectTypes = [];
    for (const projectType in ProjectType) {
      if (ProjectType.hasOwnProperty(projectType)) {
        allProjectTypes.push(ProjectType[projectType]);
      }
    }
  }
  return allProjectTypes;
};

export const isValidProjectType = (projectTypeStr: string): boolean => {
  return getAllProjectTypes().indexOf(projectTypeStr) > -1;
};

/**
 * @returns the ProjectType or NULL if invalid.
 */
export const getProjectTypeFromString = (projectTypeStr: string): ProjectType => {
  if (!isValidProjectType(projectTypeStr)) {
    return null;
  }
  return projectTypeStr as ProjectType;
};

export const getAllActions = (): string[] => {
  if (!allActions) {
    allActions = [];
    for (const action in Action) {
      if (Action.hasOwnProperty(action)) {
        allActions.push(Action[action]);
      }
    }
  }
  return allActions;
};

export const isValidAction = (actionStr: string): boolean => {
  return getAllActions().indexOf(actionStr) > -1;
};

/**
 * @returns the Action or NULL if invalid.
 */
export const getActionFromString = (actionStr: string): Action => {
  if (!isValidAction(actionStr)) {
    return null;
  }
  return actionStr as Action;
};

export const getAllValidationTypes = (): string[] => {
  if (!allValidationTypes) {
    allValidationTypes = [];
    for (const validationType in ValidationType) {
      if (ValidationType.hasOwnProperty(validationType)) {
        allValidationTypes.push(ValidationType[validationType]);
      }
    }
  }
  return allValidationTypes;
};

export const isValidValidationType = (validationTypeStr: string): boolean => {
  return getAllValidationTypes().indexOf(validationTypeStr) > -1;
};

/**
 * @returns the ValidationType or NULL if invalid.
 */
export const getValidationTypeFromString = (validationTypeStr: string): ValidationType => {
  if (!isValidValidationType(validationTypeStr)) {
    return null;
  }
  return validationTypeStr as ValidationType;
};
