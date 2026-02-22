"use client"

import * as React from "react"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { toggleVariants } from "@/components/ui/toggle"

/* -------------------------------------------------------------------------- */
/*  Context                                                                    */
/* -------------------------------------------------------------------------- */

interface ToggleGroupContextValue {
  type: "single" | "multiple"
  value: string[]
  onItemToggle: (value: string) => void
  variant?: VariantProps<typeof toggleVariants>["variant"]
  size?: VariantProps<typeof toggleVariants>["size"]
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue>({
  type: "single",
  value: [],
  onItemToggle: () => {},
})

/* -------------------------------------------------------------------------- */
/*  Root                                                                       */
/* -------------------------------------------------------------------------- */

interface ToggleGroupSingleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toggleVariants> {
  type: "single"
  value?: string
  onValueChange?: (value: string) => void
  defaultValue?: string
}

interface ToggleGroupMultipleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toggleVariants> {
  type: "multiple"
  value?: string[]
  onValueChange?: (value: string[]) => void
  defaultValue?: string[]
}

type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps

const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  ({ className, type, variant, size, children, ...props }, ref) => {
    const singleProps = props as Omit<ToggleGroupSingleProps, "className" | "type" | "variant" | "size" | "children">
    const multipleProps = props as Omit<ToggleGroupMultipleProps, "className" | "type" | "variant" | "size" | "children">

    const [internalValue, setInternalValue] = React.useState<string[]>(() => {
      if (type === "single") {
        const dv = singleProps.defaultValue ?? singleProps.value ?? ""
        return dv ? [dv] : []
      }
      return multipleProps.defaultValue ?? multipleProps.value ?? []
    })

    const value = React.useMemo(() => {
      if (type === "single") {
        const v = singleProps.value
        return v !== undefined ? (v ? [v] : []) : internalValue
      }
      const v = multipleProps.value
      return v !== undefined ? v : internalValue
    }, [type, singleProps.value, multipleProps.value, internalValue])

    const onItemToggle = React.useCallback(
      (itemValue: string) => {
        if (type === "single") {
          const newValue = value.includes(itemValue) ? "" : itemValue
          setInternalValue(newValue ? [newValue] : [])
          singleProps.onValueChange?.(newValue)
        } else {
          const newValue = value.includes(itemValue)
            ? value.filter((v) => v !== itemValue)
            : [...value, itemValue]
          setInternalValue(newValue)
          multipleProps.onValueChange?.(newValue)
        }
      },
      [type, value, singleProps, multipleProps]
    )

    return (
      <ToggleGroupContext.Provider
        value={{ type, value, onItemToggle, variant, size }}
      >
        <div
          ref={ref}
          role="group"
          className={cn("flex items-center justify-center gap-1", className)}
          {...(Object.fromEntries(
            Object.entries(props).filter(
              ([k]) =>
                !["value", "onValueChange", "defaultValue"].includes(k)
            )
          ) as React.HTMLAttributes<HTMLDivElement>)}
        >
          {children}
        </div>
      </ToggleGroupContext.Provider>
    )
  }
)
ToggleGroup.displayName = "ToggleGroup"

/* -------------------------------------------------------------------------- */
/*  Item                                                                       */
/* -------------------------------------------------------------------------- */

interface ToggleGroupItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof toggleVariants> {
  value: string
}

const ToggleGroupItem = React.forwardRef<
  HTMLButtonElement,
  ToggleGroupItemProps
>(({ className, value: itemValue, variant, size, ...props }, ref) => {
  const ctx = React.useContext(ToggleGroupContext)
  const pressed = ctx.value.includes(itemValue)

  return (
    <button
      ref={ref}
      type="button"
      role="radio"
      aria-checked={pressed}
      aria-pressed={pressed}
      data-state={pressed ? "on" : "off"}
      className={cn(
        toggleVariants({
          variant: variant ?? ctx.variant,
          size: size ?? ctx.size,
        }),
        className
      )}
      onClick={() => ctx.onItemToggle(itemValue)}
      {...props}
    />
  )
})
ToggleGroupItem.displayName = "ToggleGroupItem"

export { ToggleGroup, ToggleGroupItem }
