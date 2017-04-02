dataTypes = {
	"STRING":{
        properties: {
          title: 'String',
          value:"text",
          inputs: {
          },
          outputs: {
            output_1: {
              label: 'Output (:i)',
              multiple:true,
            }
          }
        }
      },
  "NUMBER":{
        properties: {
          title: 'Number',
          value:0,
          inputs: {
          },
          outputs: {
            output_1: {
              label: 'Output',
            }
          }
        }
      },
  "OBJECT":{
        properties: {
          title: 'Object',
          value:{},
          inputs: {
          },
          outputs: {
            output_1: {
              label: 'Output',
            }
          }
        }
      },
  "FOREACH":{
        properties: {
          title: 'foreach',
          inputs: {
              objectOrArray:{
                label:'Object or array'
            }
          },
          outputs: {
            output_1: {
              label: 'Output',
            }
          }
        }
      }
};