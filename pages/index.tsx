import React, { FC, useEffect, useState } from 'react';

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
} from '@mantine/core';

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

const GrammarChecker: FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  interface Option {
    value: string;
    label: string;
  }
  const [options, setOptions] = useState<Option[]>([]);
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
    if (!apiKey) {
      alert('Please set OPENAI_API_KEY');
      console.log('TEST:', process.env.TEST);
      return;
    }
    if (inputText == '') {
      alert('Please enter text');
      return;
    }
    try {
      setLoading(true);
      setOutputText('');
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            messages: [
              {
                role: 'system',
                content:
                  'You are a helpful assistant that corrects text grammatically.',
              },
              {
                role: 'user',
                content: `For given text: ${inputText} \n Corrected text is:`,
              },
            ],
            model: 'gpt-3.5-turbo',
            max_tokens: 3000,
            temperature: 1,
            stop: '',
          }),
        }
      );

      const data = await response.json();
      console.log(data);
      console.log(apiKey);
      setLoading(false);
      const generatedPoem = data.choices[0].message.content;

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
      console.error('Error generating poem:', error);
    }
  };

  return (
    <>
      <Grid h={'100%'} m={0}>
        <Grid.Col
          sx={(theme) => ({
            boxShadow: theme.shadows.md,
            backgroundColor: '#FDFDFD',
            borderRight: '1px solid',
            borderColor: '#D9D9D9',
          })}
          sm={12} // On small screens, take the full width
          md={6} // On medium screens, take half of the width
        >
          <Box py={24} px={'16px'} w={{ base: '100%' }}>
            <Textarea
              label="Enter or upload your text"
              value={inputText}
              placeholder="Enter or upload your text"
              onChange={(event) => {
                setInputText(event.currentTarget.value);
              }}
              minRows={10}
            />
            <Flex
              justify={'space-between'}
              direction={{
                base: 'column',
                md: 'row',
              }}
            >
              <Flex direction={'column'} justify={'center'} align={'center'}>
                <FileInput
                  mt={16}
                  iconWidth={'0px'}
                  accept=".txt"
                  value={textFile}
                  onChange={(event) => {
                    setTextFile(event);
                    handleTextFileRead(event as File);
                  }}
                  placeholder={'Select file'}
                  w={{
                    base: '70%',
                    md: '70%',
                  }}
                  ml={86}
                  icon={
                    <Box
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        backgroundColor: '#dfdfdf',
                        border: '1px solid',
                      }}
                      miw={'120px'}
                      mr={76}
                    >
                      <Text
                        style={{
                          textAlign: 'center',
                          color: '#202123',
                        }}
                      >
                        Browse file
                      </Text>
                    </Box>
                  }
                />
                <Text size={'sm'} color="gray" mt={4}>
                  Upload plain text file. Accepts .txt file
                </Text>
              </Flex>
              <Flex my={16}>
                <CopyButton value={inputText}>
                  {({ copied, copy }) => (
                    <Button
                      variant="light"
                      color="blue"
                      size="sm"
                      radius={'lg'}
                      onClick={copy}
                      style={{
                        border: '1px solid',
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-copy"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M8 8m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z"></path>
                        <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2"></path>
                      </svg>
                    </Button>
                  )}
                </CopyButton>
                <Button
                  variant="light"
                  size="sm"
                  radius={'lg'}
                  onClick={() => {
                    downLoadToTextFile(inputText, 'text.txt');
                  }}
                  color="green"
                  style={{
                    border: '1px solid',
                  }}
                  ml={16}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-download"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"></path>
                    <path d="M7 11l5 5l5 -5"></path>
                    <path d="M12 4l0 12"></path>
                  </svg>
                </Button>
                <Button
                  size="sm"
                  radius={'lg'}
                  onClick={() => {
                    setInputText('');
                  }}
                  variant="light"
                  color="pink"
                  style={{
                    border: '1px solid',
                    backgroundColor: '#f0a9a9',
                  }}
                  ml={16}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-square-x"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14z"></path>
                    <path d="M9 9l6 6m0 -6l-6 6"></path>
                  </svg>
                </Button>
              </Flex>
            </Flex>
            <Divider my="24px" />
            <Button
              variant="light"
              color="violet"
              w={'100%'}
              style={{
                border: '1px solid',
              }}
              onClick={() => {
                handleGenerate();
              }}
              leftIcon={
                <svg
                  color="#3b05ef"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="#3b05ef"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.50006 5.6L10.0001 7L8.60006 4.5L10.0001 2L7.50006 3.4L5.00006 2L6.40006 4.5L5.00006 7L7.50006 5.6ZM19.5001 15.4L17.0001 14L18.4001 16.5L17.0001 19L19.5001 17.6L22.0001 19L20.6001 16.5L22.0001 14L19.5001 15.4ZM22.0001 2L19.5001 3.4L17.0001 2L18.4001 4.5L17.0001 7L19.5001 5.6L22.0001 7L20.6001 4.5L22.0001 2ZM14.3701 7.29C13.9801 6.9 13.3501 6.9 12.9601 7.29L1.29006 18.96C0.900059 19.35 0.900059 19.98 1.29006 20.37L3.63006 22.71C4.02006 23.1 4.65006 23.1 5.04006 22.71L16.7001 11.05C17.0901 10.66 17.0901 10.03 16.7001 9.64L14.3701 7.29ZM13.3401 12.78L11.2201 10.66L13.6601 8.22L15.7801 10.34L13.3401 12.78Z"
                    fill="#3b05ef"
                  />
                </svg>
              }
            >
              <Text>Fix Grammatical Errors</Text>
            </Button>
          </Box>
        </Grid.Col>
        <Grid.Col
          sx={(theme) => ({
            boxShadow: theme.shadows.md,
            backgroundColor: '#FDFDFD',
            borderRight: '1px solid',
            borderColor: '#D9D9D9',
          })}
          sm={12} // On small screens, take the full width
          md={6} // On medium screens, take half of the width
        >
          <Box
            py={24}
            px={'16px'}
            w={{ base: '100%' }}
            pos={'relative'}
            h={'100vh'}
          >
            <LoadingOverlay
              visible={loading}
              zIndex={1000}
              overlayOpacity={0.5}
              loaderProps={{ color: 'violet', type: 'bars' }}
            />
            {
              <>
                <Textarea
                  label="Grammatically Corrected Text"
                  value={outputText}
                  readOnly
                  minRows={10}
                  placeholder="Your Corrected Text will appear here"
                />
                <Flex
                  justify={'space-between'}
                  direction={{
                    base: 'column',
                    md: 'row',
                  }}
                >
                  <Flex my={16}>
                    <CopyButton value={outputText}>
                      {({ copied, copy }) => (
                        <Button
                          variant="light"
                          color="blue"
                          size="sm"
                          radius={'lg'}
                          onClick={copy}
                          style={{
                            border: '1px solid',
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-copy"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            <path
                              stroke="none"
                              d="M0 0h24v24H0z"
                              fill="none"
                            ></path>
                            <path d="M8 8m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z"></path>
                            <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2"></path>
                          </svg>
                        </Button>
                      )}
                    </CopyButton>
                    <Button
                      variant="light"
                      size="sm"
                      radius={'lg'}
                      onClick={() => {
                        downLoadToTextFile(outputText, 'output.txt');
                      }}
                      color="green"
                      style={{
                        border: '1px solid',
                      }}
                      ml={16}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-download"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"></path>
                        <path d="M7 11l5 5l5 -5"></path>
                        <path d="M12 4l0 12"></path>
                      </svg>
                    </Button>
                    <Button
                      size="sm"
                      radius={'lg'}
                      onClick={() => {
                        setOutputText('');
                      }}
                      variant="light"
                      color="pink"
                      style={{
                        border: '1px solid',
                        backgroundColor: '#f0a9a9',
                      }}
                      ml={16}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-square-x"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14z"></path>
                        <path d="M9 9l6 6m0 -6l-6 6"></path>
                      </svg>
                    </Button>
                  </Flex>
                </Flex>
                <Divider my="35px" />
              </>
            }
          </Box>
        </Grid.Col>
      </Grid>
    </>
  );
};

export default GrammarChecker;
