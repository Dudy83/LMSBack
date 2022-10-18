
module.exports = ({ env }) => ({
  dashboard : {
    enabled: true,
    resolve: "./src/plugins/Dashboard",
  },


  'entity-notes': {
    enabled: true,
  },
 
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        accessKeyId: env('AWS_ACCESS_KEY_ID'),
        secretAccessKey: env('AWS_ACCESS_SECRET'),
        region: env('AWS_REGION'),
        params: {
          Bucket: env('AWS_BUCKET_NAME'),
        },
        logger: console
      }
    }
  },
  // 'wysiwsg-react-md-editor' : {
  //   enabled: true,

  // },
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'ssl0.ovh.net'),
        port: env('SMTP_PORT', 587),

        auth: {
          user: 'contact@pmemanageur.com',
          pass: 'Pkolpkol13!',
        },
        tls: {
          ciphers: 'SSLv3'
        }

      },
      settings: {
        defaultFrom: 'contact@pmemanageur.com',
        defaultReplyTo: 'contact@pmemanageur.com',
      },
    },
  },

  // email: {
  //   config: {
  //     provider: 'sendgrid',
  //     providerOptions: {
  //       apiKey: env('SENDGRID_API_KEY'),
  //     },
  //     settings: {
  //       defaultFrom: 'contact@pmemanageur.com',
  //       defaultReplyTo: 'contact@pmemanageur.com',
  //     },
  //   },
  //   },
  seo: {
    enabled: true,
  },

  tasks: {
    enabled: false,
    resolve: "./src/plugins/Tasks",
  },
  notifications: {
    enabled: false,
    resolve: "./src/plugins/Notifications",
  },
  campagnes: {
    enabled: false,
    resolve: "./src/plugins/Campagnes",
  },
  chat: {
    enabled: false,
    resolve: "./src/plugins/Chat",
  },
  'email-designer': {
    enabled: true,

    config: {
      editor: {
        projectId: ["8H6UTd317OS4Fb3FQv2BS2IIebhr2uPkOikK5yZk2hujZrKuawJDS9vV8OkNSZfh"],

        tools: {
          heading: {
            properties: {
              text: {
                value: 'This is the new default text!',
              },
            },
          },
        },
        options: {
          features: {
            colorPicker: {
              presets: ['#D9E3F0', '#F47373', '#697689', '#37D67A'],
            },
          },
          fonts: {
            showDefaultFonts: false,
            /*
             * If you want use a custom font you need a premium unlayer account and pass a projectId number :-(
             */
            customFonts: [
              {
                label: 'Anton',
                value: "'Anton', sans-serif",
                url: 'https://fonts.googleapis.com/css?family=Anton',
              },
              {
                label: 'Lato',
                value: "'Lato', Tahoma, Verdana, sans-serif",
                url: 'https://fonts.googleapis.com/css?family=Lato',
              },
              // ...
            ],
          },
          mergeTags: [
            {
              name: 'Email',
              value: '{{= USER.username }}',
              sample: 'john@doe.com',
            },
            // ...
          ],
        },
        appearance: {
          theme: 'dark',
          panels: {
            tools: {
              dock: 'left',
            },
          },
        },
      },
    },
  },
  'color-picker': {
    enabled: true,
    resolve: './src/plugins/color-picker'
  },
});
