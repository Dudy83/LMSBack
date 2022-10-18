
    const mutateLayout = layout => layout.map(row=> {
        const mutatedRow = row.reduce((acc,field)=>{
            const hashMapFieldEnabled = field.fieldSchema.pluginOptions?.['colorpicker'].enabled
            if(!hashMapFieldEnabled){
                return [...acc, field]
            }

            return [...acc, {...field,fieldSchema : {...field.fieldSchema,}}]
        }, [])
        return mutatedRow
    })

const mutateEditViewHook = ({layout, query}) => {
    const mutatedEditLayout = mutateLayout(layout.contentType.layouts)
    const enhancedLayouts = { ...layout.contentType.layouts,
    edit: mutatedEditLayout}
    return {
        query,
        layout : {
            ...layout,
            contentType : {
                ...layout.contentType,
                layouts : enhancedLayouts,
            }
        }
    }
}
export default mutateEditViewHook;