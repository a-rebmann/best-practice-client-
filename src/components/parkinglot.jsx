



<ToolbarSelect
onChange={(x) => {
  console.log(
    x.detail.selectedOption.innerText === 'Show only non-conformant'
  );
  setShowOnlyNonConformant(
    x.detail.selectedOption.innerText === 'Show only non-conformant'
  );
  if (
    x.detail.selectedOption.innerText === 'Show only non-conformant'
  ) {
    setVariantData(
        variantData
        .filter((x) => x.isFaulty))
  } else {
    setVariantData(variantData);
  }
}}
>
<ToolbarSelectOption selected={!showOnlyNonConformant}>
  Show all
</ToolbarSelectOption>
<ToolbarSelectOption selected={showOnlyNonConformant}>
  Show only non-conformant
</ToolbarSelectOption>
</ToolbarSelect>