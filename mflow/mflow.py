import numpy as np
import scipy
from scipy.misc import imread
import maxflow
import sys
from matplotlib import pyplot as ppl

if len(sys.argv) != 5:
    print "USAGE: python mflow.py <input image> <fg mat> <bg mat> <output>"
    sys.exit(1)

import numpy as np
import scipy
from scipy.misc import imread
import maxflow
import sys
import os
import cv2
from matplotlib import pyplot as ppl


# Lots of help from...
# http://docs.opencv.org/master/d8/d83/tutorial_py_grabcut.html#gsc.tab=0

input_image, fg_mat, bg_mat, output_image = sys.argv[1], sys.argv[2],sys.argv[3],sys.argv[4]

img_input = cv2.imread(input_image)
img_fg = cv2.imread(fg_mat,0)
img_bg = cv2.imread(bg_mat,0)

mask = np.zeros(img_input.shape[:2],np.uint8)

bgdModel = np.zeros((1,65), np.float64)
fgdModel = np.zeros((1,65), np.float64)

mask[:] = 3
mask[img_bg != 0] = 0
mask[img_fg != 0] = 1

rect = None
cv2.grabCut(img_input, mask, rect, bgdModel, fgdModel, 5, cv2.GC_INIT_WITH_MASK)
mask2 = np.where((mask==2)|(mask==0),0,1).astype('uint8')
img_out = img_input*mask2[:,:,np.newaxis]

# ppl.imshow(img_out)
# ppl.show()

cv2.imwrite(output_image, img_out)
