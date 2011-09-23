#!/usr/bin/env perl

while (<>) {
  chomp;
  @matches = /([[:xdigit:]]{2})([[:xdigit:]]{2})\s/g;
  foreach $match (@matches) {
    print chr(hex($match));
  }
}