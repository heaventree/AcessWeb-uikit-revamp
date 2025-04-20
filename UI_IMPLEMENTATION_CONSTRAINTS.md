
# UI Implementation Constraints

## General Rules

1. **Follow Existing Patterns**: Always match the pattern of existing components in style and structure
2. **No Layout Changes**: Don't modify layout structure unless explicitly requested
3. **Component Preservation**: Keep all existing props, event handlers, and functional code
4. **Focus on Styling Only**: Change only CSS/styling aspects unless asked to modify functionality 
5. **Stay Within Scope**: Only modify the specific components mentioned in the request

## Implementation Process

1. First analyze the existing component structure  
2. Identify what specific styling needs to change
3. Make minimal changes to achieve the requested styling
4. Preserve all functional aspects of the component

## References

- Use components in `client/src/components/ui` as style references
- Follow patterns in `AccessibilityControls.tsx` for accessibility components
- Refer to shadcn/ui patterns for component styling

## Common Pitfalls to Avoid

- Don't introduce new dependencies or libraries
- Don't change component APIs (props, methods, events)
- Don't rewrite entire components when minimal changes would suffice
- Don't modify parent/container components when only child styling is requested
