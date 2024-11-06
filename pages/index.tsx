import React, { FC, useEffect, useState } from 'react';
import { GeistSans } from 'geist/font/sans';
import {
  TextInput,
  NumberInput,
  Select,
  Box,
  Flex,
  Divider,
  Text,
  Grid,
  Button,
  CopyButton,
  Table,
  Tabs,
  ScrollArea,
  Textarea,
  LoadingOverlay,
  FileInput,
  FileButton,
  ColorSchemeProvider,
  MantineProvider,
  ColorScheme,
} from '@mantine/core';
import dynamic from 'next/dynamic';
const QuillEditor = dynamic(() => import('react-quill'), {
  ssr: false, // This ensures it's not loaded during server-side rendering
});
import 'react-quill/dist/quill.snow.css';
import StyledButton from '@/components/StyledButton';
import {
  IconCopy,
  IconDownload,
  IconPrinter,
  IconX,
} from '@tabler/icons-react';

type Language = 'en' | 'es' | 'pt';

type HomeProps = {
  theme?: string; // 'light' | 'dark'
  lang?: Language; // 'en' | 'es' | 'pt'
};

const Home: React.FC<HomeProps> = (props) => {
  useEffect(() => {
    console.log('props', props);
  }, [props]);
  // App theme setup
  const [app_theme, setAppTheme] = useState<string>(props.theme || 'dark');
  const toggleColorScheme = (value?: ColorScheme) => {
    // console.log('Toggle color scheme', value);
    setAppTheme(value === 'dark' ? 'dark' : 'light');
  };
  useEffect(() => {
    if (props.theme) {
      toggleColorScheme(props.theme === 'dark' ? 'dark' : 'light');
    }
  }, [props.theme]);
  const [app_lang, setAppLang] = useState<'en' | 'es' | 'pt'>(
    props.lang || 'en'
  );
  useEffect(() => {
    // console.log('PROPS: ', props);
    if (props.lang) {
      setAppLang(props.lang);
    }
  }, [props.lang]);
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  interface Option {
    value: string;
    label: string;
  }
  const [loading, setLoading] = useState(false);

  const [textFile, setTextFile] = useState<File | null>(null);
  const [OutputTextFile, setOutputTextFile] = useState<File | null>(null);

  const downLoadToTextFile = (content: string, file_name: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = file_name;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const handleTextFileRead = (textFile: File) => {
    if (textFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        setInputText(text as string);
      };
      reader.readAsText(textFile);
    }
  };

  const handleOutputTextFileRead = (OutputTextFile: File) => {
    if (OutputTextFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        setOutputText(text as string);
      };
      reader.readAsText(OutputTextFile);
    }
  };

  const handleGenerate = async () => {
    if (inputText == '') {
      alert('Please enter text');
      return;
    }
    try {
      setLoading(true);
      setOutputText('');
      const response = await fetch(
        'https://grammar-checker-microapp.vercel.app/api/endpoint',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputText: inputText,
          }),
        }
      );

      const data = await response.json();
      setLoading(false);
      const generatedPoem = data.correctedText;
      // Split the poem into words
      const words = generatedPoem.split('');

      // Initialize an index to keep track of the current word
      let currentIndex = 0;

      // Initialize outputText as an empty string
      let outputText = '';
      // Function to display words one by one
      const displayWord = () => {
        if (currentIndex < words.length) {
          outputText += words[currentIndex]; // Add a space
          setOutputText(outputText.trim()); // Remove trailing space
          currentIndex++;
          setTimeout(displayWord, 50); // Adjust the delay (in milliseconds) as needed
        }
      };
      displayWord();
    } catch (error) {
      console.error(translations[app_lang].ERROR, error);
    }
  };

  return (
    <>
      <ColorSchemeProvider
        colorScheme={app_theme === 'dark' ? 'dark' : 'light'}
        toggleColorScheme={() => {}}
      >
        <MantineProvider
          theme={{
            colorScheme: app_theme === 'dark' ? 'dark' : 'light',
            fontFamily: GeistSans.style.fontFamily,
          }}
          withGlobalStyles
          withNormalizeCSS
        >
          <style jsx global>{`
            .ql-toolbar {
              border: 1px solid ${app_theme === 'dark' ? '#2C2C30' : '#ccc'} !important;
              border-radius: 25px 25px 0 0;
            }
            .ql-editor {
              height: 300px;
            }
            #output-box .ql-editor {
              height: 368px;
            }
            .ql-container {
              border: 1px solid ${app_theme === 'dark' ? '#2C2C30' : '#ccc'} !important;
              border-radius: 0 0 25px 25px;
            }
            ${app_theme === 'dark'
              ? `.ql-toolbar svg,
.ql-toolbar rect,
.ql-toolbar line,
.ql-toolbar path,
.ql-toolbar span {
          /* fill: #ccc !important; */
          stroke: #ccc !important;
          color: #ccc !important; 
        }`
              : ''}

            ::-webkit-scrollbar {
              width: 8px;
              height: 8px;
            }

            ::-webkit-scrollbar-track {
              background: transparent; /* Background of the scrollbar track */
            }

            ::-webkit-scrollbar-thumb {
              background-color: #888; /* Color of the scrollbar handle */
              border-radius: 10px;
              border: 3px solid transparent; /* Padding around the handle */
              background-clip: padding-box;
            }

            ::-webkit-scrollbar-thumb:hover {
              background-color: #555; /* Darker color when hovered */
            }
          `}</style>
          <Grid
            mih={'100vh'}
            m={0}
            bg={app_theme === 'dark' ? '#000000' : '#FFFFFF'}
          >
            <Grid.Col
              sx={(theme) => ({
                borderRight: '1px solid',
                borderColor: app_theme === 'dark' ? '#2C2C30' : '#E5E5E5AE',
              })}
              sm={12} // On small screens, take the full width
              md={6} // On medium screens, take half of the width
            >
              <Text size={'lg'} weight={700} mb={12} mt={48} mx={20}>
                {translations[app_lang].UPLOAD_TEXT_FILE}
              </Text>
              <Box px={'20px'} w={{ base: '100%' }}>
                <Box
                  style={{
                    border:
                      '1px solid ' +
                      (app_theme === 'dark' ? '#2f2e2e' : '#CDCDCDFF'),
                    borderRadius: '24px',
                    padding: '3px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  mx={{
                    base: 'auto',
                    md: 0,
                    lg: 0,
                  }}
                  // miw={350}
                  // maw={300}
                  mb={24}
                >
                  <FileButton
                    accept=".txt,.html"
                    onChange={(file) => {
                      setTextFile(file);
                    }}
                  >
                    {(props) => (
                      <Button
                        {...props}
                        size="sm"
                        style={{
                          borderRadius: '24px',
                          zIndex: 1,
                          // padding: '0px',
                          color: app_theme === 'dark' ? '#CDCDCDFF' : '#141415',
                          backgroundColor:
                            app_theme === 'dark' ? '#141415' : '#EDEDEE',
                        }}
                        w={'120px'}
                      >
                        {translations[app_lang].BROWSE}
                      </Button>
                    )}
                  </FileButton>
                  <FileInput
                    accept=".txt,.html"
                    value={textFile}
                    onChange={(event) => {
                      setTextFile(event);
                      handleTextFileRead(event as File);
                    }}
                    // w={'100%'}
                    style={{
                      border: 'none',
                    }}
                    styles={(theme) => ({
                      input: {
                        border: 'none',
                        backgroundColor: 'transparent',
                      },
                    })}
                    placeholder={translations[app_lang].NO_FILE_SELECTED}
                    clearable
                  />
                </Box>
                <QuillEditor
                  value={inputText}
                  onChange={(value) => {
                    setInputText(value);
                  }}
                  theme={'snow'}
                  style={{
                    minHeight: '300px',
                  }}
                  placeholder={translations[app_lang].INPUT_PLACEHOLDER}
                />
                <Flex
                  mt={24}
                  justify={'space-between'}
                  align={{
                    md: 'center',
                  }}
                  direction={{
                    base: 'column',
                    md: 'row',
                  }}
                  mb={48}
                  gap={8}
                >
                  <Flex gap={4} py={4}>
                    <CopyButton value={inputText}>
                      {({ copied, copy }) => (
                        <Button
                          variant="outline"
                          onClick={copy}
                          style={{
                            backgroundColor: 'transparent',
                            padding: '2px',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                          }}
                          styles={{
                            root: {
                              color:
                                app_theme === 'dark' ? '#EDEDEE' : '#141415',
                              border:
                                '1px solid ' +
                                (app_theme === 'dark' ? '#2C2C30' : '#141415'),
                              '&:hover': {
                                backgroundColor:
                                  (app_theme === 'light'
                                    ? '#fafafa'
                                    : '#2C2C30') + '!important',
                              },
                              '&:disabled': {
                                color:
                                  app_theme === 'dark' ? '#76767F' : '#C5C5C9',
                                border:
                                  '1px solid ' +
                                  (app_theme === 'dark'
                                    ? '#76767F'
                                    : '#C5C5C9'),
                              },
                            },
                          }}
                          disabled={inputText === ''}
                        >
                          <IconCopy size={18} />
                        </Button>
                      )}
                    </CopyButton>
                    <Button
                      variant="filled"
                      style={{
                        backgroundColor: 'transparent',
                        padding: '2px',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                      }}
                      styles={{
                        root: {
                          color: app_theme === 'dark' ? '#EDEDEE' : '#141415',
                          border:
                            '1px solid ' +
                            (app_theme === 'dark' ? '#2C2C30' : '#141415'),
                          '&:hover': {
                            backgroundColor:
                              (app_theme === 'light' ? '#fafafa' : '#2C2C30') +
                              '!important',
                          },
                          '&:disabled': {
                            color: app_theme === 'dark' ? '#76767F' : '#C5C5C9',
                            border:
                              '1px solid ' +
                              (app_theme === 'dark' ? '#76767F' : '#C5C5C9'),
                          },
                        },
                      }}
                      disabled={inputText === ''}
                      onClick={() => {
                        downLoadToTextFile(inputText, 'input.txt');
                      }}
                    >
                      <IconDownload size={18} />
                    </Button>
                    <Button
                      style={{
                        backgroundColor: 'transparent',
                        padding: '2px',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        border: 'none',
                      }}
                      styles={{
                        root: {
                          color: app_theme === 'dark' ? '#EDEDEE' : '#141415',
                          '&:hover': {
                            color: '#ff0000',
                          },
                          '&:disabled': {
                            color: app_theme === 'dark' ? '#76767F' : '#C5C5C9',
                          },
                        },
                      }}
                      onClick={() => {
                        setInputText('');
                      }}
                      disabled={inputText === ''}
                      variant="outline"
                    >
                      <IconX size={18} />
                    </Button>
                  </Flex>
                  <StyledButton
                    app_theme={app_theme}
                    loading={loading}
                    onClick={handleGenerate}
                    icon={
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.5 4.33341V2.66675M13.5 14.3334V12.6667M7.66667 8.50008H9.33333M17.6667 8.50008H19.3333M15.8333 10.8334L16.8333 11.8334M15.8333 6.16675L16.8333 5.16675M3.5 18.5001L11 11.0001M11.1667 6.16675L10.1667 5.16675"
                          stroke="#909098"
                          stroke-width="1.75"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    }
                    disabled={inputText === ''}
                    label={translations[app_lang].BUTTON_LABEL}
                  />
                </Flex>
              </Box>
            </Grid.Col>
            <Grid.Col
              sx={(theme) => ({
                boxShadow: theme.shadows.md,
              })}
              sm={12} // On small screens, take the full width
              md={6} // On medium screens, take half of the width
            >
              <Box px={'20px'} w={{ base: '100%' }} pos={'relative'}>
                <Text size={'lg'} weight={700} mb={12} mt={48}>
                  {translations[app_lang].CORRECTED_TEXT}
                </Text>
                <LoadingOverlay
                  visible={loading}
                  zIndex={1000}
                  overlayOpacity={0.5}
                  loaderProps={{ color: 'violet', type: 'bars' }}
                />
                {!outputText && (
                  <Text
                    size={'md'}
                    weight={100}
                    color={app_theme === 'dark' ? '#EDEDEE' : 'gray'}
                    mb={8}
                  >
                    {translations[app_lang].THE_CORRECTED_TEXT_WILL_APPEAR_HERE}
                  </Text>
                )}
                {outputText && (
                  <div id="output-box">
                    <QuillEditor
                      value={outputText}
                      onChange={(value) => {
                        setOutputText(value);
                      }}
                      theme={'snow'}
                      style={{
                        minHeight: '300px',
                      }}
                      placeholder={translations[app_lang].OUTPUT_PLACEHOLDER}
                    />
                  </div>
                )}
                {outputText && (
                  <Flex
                    mt={24}
                    justify={'flex-end'}
                    align={{
                      md: 'center',
                    }}
                    mb={48}
                    gap={8}
                  >
                    <Flex gap={4} py={4}>
                      <CopyButton value={inputText}>
                        {({ copied, copy }) => (
                          <Button
                            variant="outline"
                            onClick={copy}
                            style={{
                              backgroundColor: 'transparent',
                              padding: '2px',
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                            }}
                            styles={{
                              root: {
                                color:
                                  app_theme === 'dark' ? '#EDEDEE' : '#141415',
                                border:
                                  '1px solid ' +
                                  (app_theme === 'dark'
                                    ? '#2C2C30'
                                    : '#141415'),
                                '&:hover': {
                                  backgroundColor:
                                    (app_theme === 'light'
                                      ? '#fafafa'
                                      : '#2C2C30') + '!important',
                                },
                                '&:disabled': {
                                  color:
                                    app_theme === 'dark'
                                      ? '#76767F'
                                      : '#C5C5C9',
                                  border:
                                    '1px solid ' +
                                    (app_theme === 'dark'
                                      ? '#76767F'
                                      : '#C5C5C9'),
                                },
                              },
                            }}
                            disabled={inputText === ''}
                          >
                            <IconCopy size={18} />
                          </Button>
                        )}
                      </CopyButton>
                      <Button
                        variant="filled"
                        style={{
                          backgroundColor: 'transparent',
                          padding: '2px',
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                        }}
                        styles={{
                          root: {
                            color: app_theme === 'dark' ? '#EDEDEE' : '#141415',
                            border:
                              '1px solid ' +
                              (app_theme === 'dark' ? '#2C2C30' : '#141415'),
                            '&:hover': {
                              backgroundColor:
                                (app_theme === 'light'
                                  ? '#fafafa'
                                  : '#2C2C30') + '!important',
                            },
                            '&:disabled': {
                              color:
                                app_theme === 'dark' ? '#76767F' : '#C5C5C9',
                              border:
                                '1px solid ' +
                                (app_theme === 'dark' ? '#76767F' : '#C5C5C9'),
                            },
                          },
                        }}
                        disabled={inputText === ''}
                        onClick={() => {
                          downLoadToTextFile(inputText, 'input.txt');
                        }}
                      >
                        <IconDownload size={18} />
                      </Button>
                      <Button
                        style={{
                          backgroundColor: 'transparent',
                          padding: '2px',
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          border: 'none',
                        }}
                        styles={{
                          root: {
                            color: app_theme === 'dark' ? '#EDEDEE' : '#141415',
                            '&:hover': {
                              color: '#ff0000',
                            },
                            '&:disabled': {
                              color:
                                app_theme === 'dark' ? '#76767F' : '#C5C5C9',
                            },
                          },
                        }}
                        onClick={() => {
                          setInputText('');
                        }}
                        disabled={inputText === ''}
                        variant="outline"
                      >
                        <IconX size={18} />
                      </Button>
                    </Flex>
                  </Flex>
                )}
              </Box>
            </Grid.Col>
          </Grid>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
};

export default Home;

const translations = {
  en: {
    ERROR: 'Error generating poem:',
    UPLOAD_TEXT_FILE: 'Upload text file',
    BROWSE: 'Browse',
    NO_FILE_SELECTED: 'No file selected',
    INPUT_PLACEHOLDER: 'Enter text here',
    BUTTON_LABEL: 'Check Grammar',
    CORRECTED_TEXT: 'Grammatically Corrected Text',
    THE_CORRECTED_TEXT_WILL_APPEAR_HERE: 'The corrected text will appear here.',
    OUTPUT_PLACEHOLDER: 'Your Corrected Text will appear here',
  },
  es: {
    ERROR: 'Error generando poema:',
    UPLOAD_TEXT_FILE: 'Subir archivo de texto',
    BROWSE: 'Navegar',
    NO_FILE_SELECTED: 'Ningún archivo seleccionado',
    INPUT_PLACEHOLDER: 'Ingrese el texto aquí',
    BUTTON_LABEL: 'Verificar gramática',
    CORRECTED_TEXT: 'Texto corregido gramaticalmente',
    THE_CORRECTED_TEXT_WILL_APPEAR_HERE: 'El texto corregido aparecerá aquí.',
    OUTPUT_PLACEHOLDER: 'Su texto corregido aparecerá aquí',
  },
  pt: {
    ERROR: 'Erro ao gerar poema:',
    UPLOAD_TEXT_FILE: 'Carregar arquivo de texto',
    BROWSE: 'Navegar',
    NO_FILE_SELECTED: 'Nenhum arquivo selecionado',
    INPUT_PLACEHOLDER: 'Insira o texto aqui',
    BUTTON_LABEL: 'Verificar gramática',
    CORRECTED_TEXT: 'Texto corrigido gramaticalmente',
    THE_CORRECTED_TEXT_WILL_APPEAR_HERE: 'O texto corrigido aparecerá aqui.',
    OUTPUT_PLACEHOLDER: 'Seu texto corrigido aparecerá aqui',
  },
};
