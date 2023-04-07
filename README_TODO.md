### TODO

- Input Validations DTO preferrably using domain methods for domain properties validations
- Rename all objects/interfaces between methods/layers to '...DTO'
- Evaluate if the exception mapper used in entrypoints are still necessary now that each exception has it's own class. It can be replaced by simple if statements checking the errors with 'instanceof'
