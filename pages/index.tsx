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
  FileButton,
} from '@mantine/core';
import dynamic from 'next/dynamic';
const QuillEditor = dynamic(() => import('react-quill'), {
  ssr: false, // This ensures it's not loaded during server-side rendering
});
import 'react-quill/dist/quill.snow.css';

const GrammarChecker: FC = () => {
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
      console.error('Error generating poem:', error);
    }
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .ql-editor {
        height: 300px;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
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
            <Flex
              justify={'space-between'}
              direction={{
                base: 'column',
                md: 'row',
              }}
              gap={8}
              my={8}
            >
              <Flex w={'100%'}>
                <FileButton
                  accept=".txt,.html"
                  onChange={(event) => {
                    setTextFile(event);
                    handleTextFileRead(event as File);
                  }}
                >
                  {(props) => (
                    <Button
                      {...props}
                      variant="light"
                      color="violet"
                      size="sm"
                      style={{
                        border: '1px solid',
                        borderTopRightRadius: '0px',
                        borderBottomRightRadius: '0px',
                        zIndex: 1,
                      }}
                      mr={'-4px'}
                      w={'120px'}
                    >
                      Browse
                    </Button>
                  )}
                </FileButton>
                <FileInput
                  iconWidth={'0px'}
                  accept=".txt,.html"
                  value={textFile}
                  clearable
                  onChange={(event) => {
                    setTextFile(event);
                    handleTextFileRead(event as File);
                  }}
                  placeholder={'Select file'}
                  w={{
                    base: '100%',
                    md: '100%',
                  }}
                />
              </Flex>
              <Flex gap={8}>
                <CopyButton value={inputText}>
                  {({ copied, copy }) => (
                    <Button
                      variant="light"
                      color="violet"
                      size="sm"
                      radius={'sm'}
                      onClick={copy}
                      style={{
                        border: '1px solid',
                      }}
                    >
                      {copied ? 'Copied' : 'Copy'}
                    </Button>
                  )}
                </CopyButton>

                <Button
                  size="sm"
                  radius={'sm'}
                  onClick={() => {
                    setInputText('');
                    setOutputText('');
                  }}
                  variant="light"
                  color="pink"
                  style={{
                    border: '1px solid red',
                  }}
                >
                  <Text
                    style={{
                      color: 'red',
                    }}
                  >
                    Clear
                  </Text>
                </Button>
              </Flex>
            </Flex>
            <QuillEditor
              value={inputText}
              onChange={(value) => {
                setInputText(value);
              }}
              theme={'snow'}
              style={{
                minHeight: '300px',
              }}
              placeholder="Enter text here"
            />
            {/* <Textarea
              label="Enter or upload your text"
              value={inputText}
              placeholder="Enter or upload your text"
              onChange={(event) => {
                setInputText(event.currentTarget.value);
              }}
              minRows={10}
            /> */}
            <Flex justify={'flex-end'} my={8}>
              <Button
                variant="light"
                color="green"
                style={{
                  border: '1px solid',
                }}
                onClick={() => {
                  downLoadToTextFile(inputText, 'input.txt');
                }}
              >
                Download Text
              </Button>
            </Flex>
            {/* <Divider my="24px" /> */}
            <Flex>
              <Button
                variant="light"
                color="violet"
                w={{
                  base: '100%',
                  md: '80%',
                }}
                mx={'auto'}
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
            </Flex>
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
                <Flex
                  justify={'space-between'}
                  direction={{
                    base: 'column',
                    md: 'row',
                  }}
                  gap={8}
                  my={8}
                >
                  <Text size={'lg'} weight={900}>
                    Grammatically Corrected Text
                  </Text>
                  <CopyButton value={outputText}>
                    {({ copied, copy }) => (
                      <Button
                        variant="light"
                        color="violet"
                        size="sm"
                        radius={'sm'}
                        onClick={copy}
                        style={{
                          border: '1px solid',
                        }}
                      >
                        {copied ? 'Copied' : 'Copy'}
                      </Button>
                    )}
                  </CopyButton>
                </Flex>
                {/* <Textarea
                  label="Grammatically Corrected Text"
                  value={outputText}
                  readOnly
                  minRows={10}
                  placeholder="Your Corrected Text will appear here"
                /> */}
                <QuillEditor
                  value={outputText}
                  readOnly
                  theme={'snow'}
                  style={{
                    minHeight: '300px',
                  }}
                  placeholder="Your Corrected Text will appear here"
                />
                <Flex justify={'flex-end'} my={8}>
                  <Button
                    variant="light"
                    color="green"
                    style={{
                      border: '1px solid',
                    }}
                    onClick={() => {
                      downLoadToTextFile(outputText, 'output.txt');
                    }}
                  >
                    Download Text
                  </Button>
                </Flex>
              </>
            }
          </Box>
        </Grid.Col>
      </Grid>
    </>
  );
};

export default GrammarChecker;
