import * as React from "react"

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

const Slot = React.forwardRef<HTMLElement, SlotProps>(
  ({ children, ...props }, ref) => {
    if (React.isValidElement(children)) {
      return React.cloneElement(children, {
        ...mergeProps(props, children.props as Record<string, unknown>),
        ref: ref
          ? composeRefs(ref, (children as React.ReactElement & { ref?: React.Ref<HTMLElement> }).ref ?? null)
          : (children as React.ReactElement & { ref?: React.Ref<HTMLElement> }).ref,
      } as Record<string, unknown>)
    }

    if (React.Children.count(children) > 1) {
      React.Children.only(null)
    }

    return null
  }
)
Slot.displayName = "Slot"

function mergeProps(
  slotProps: Record<string, unknown>,
  childProps: Record<string, unknown>
) {
  const overrideProps = { ...childProps }

  for (const propName in childProps) {
    const slotPropValue = slotProps[propName]
    const childPropValue = childProps[propName]

    const isHandler = /^on[A-Z]/.test(propName)
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args: unknown[]) => {
          ;(childPropValue as (...args: unknown[]) => void)(...args)
          ;(slotPropValue as (...args: unknown[]) => void)(...args)
        }
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue
      }
    } else if (propName === "style") {
      overrideProps[propName] = { ...(slotPropValue as object), ...(childPropValue as object) }
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue]
        .filter(Boolean)
        .join(" ")
    }
  }

  return { ...slotProps, ...overrideProps }
}

function composeRefs<T>(...refs: (React.Ref<T> | null | undefined)[]) {
  return (node: T) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(node)
      } else if (ref != null) {
        ;(ref as React.MutableRefObject<T>).current = node
      }
    })
  }
}

export { Slot }
